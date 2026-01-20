// Bắt đầu thực thi code sau khi toàn bộ cây DOM của trang đã được tải xong.
// Điều này đảm bảo tất cả các element HTML đã sẵn sàng để JavaScript thao tác.
document.addEventListener('DOMContentLoaded', () => {

    // === BƯỚC 1: LẤY CÁC ELEMENT HTML CẦN THIẾT ===
    // === BƯỚC 1: LẤY CÁC ELEMENT HTML CẦN THIẾT ===
    const cartItemsContainer = document.getElementById('cart-items-container');
    const token = localStorage.getItem('token');

    // Các element cho bulk actions
    const selectAllCheckbox = document.getElementById('select-all-cart');
    const deleteSelectedBtn = document.getElementById('delete-selected-btn');

    // Nếu LÀ trang giỏ hàng (có container) thì mới kiểm tra đăng nhập
    if (cartItemsContainer) {
        if (!token) {
            window.location.href = '/login';
            return;
        }
    } else {
        // Nếu không phải trang giỏ hàng, dừng thực thi việc RENDER giỏ hàng
        // NHƯNG vẫn giữ lại các hàm global như addToCart (được định nghĩa bên dưới)
        return;
    }
    sessionStorage.removeItem('promoCodeToCheckout');
    sessionStorage.removeItem('discountAmountApplied');
    // Các element mới cho phần tóm tắt đơn hàng
    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingFeeEl = document.getElementById('shipping-fee');
    const discountRow = document.getElementById('discount-row');
    const discountAmountEl = document.getElementById('discount-amount');
    const finalTotalEl = document.getElementById('final-total');
    // Các element cho phần khuyến mãi
    const applyBtn = document.getElementById('apply-promo-btn');
    const promoInput = document.getElementById('promo-code-input');
    const promoMessage = document.getElementById('promo-message');
    // <<< LẤY THÊM ELEMENT CHO CHỨC NĂNG HỦY >>>
    const promoTextMessage = document.getElementById('promo-text-message');
    const removePromoBtn = document.getElementById('remove-promo-btn');

    // Biến để lưu trữ trạng thái của giỏ hàng và khuyến mãi trên toàn trang.
    let currentCart = null;
    let currentDiscountAmount = 0; // Số tiền được giảm
    // let serverSubtotal = 0; // KHÔNG DÙNG SERVER SUBTOTAL NỮA, TÍNH THEO SELECTION

    // MỚI: Lưu toàn bộ item ID và giá/số lượng để tính subtotal global
    let globalItemSummaries = [];

    // Set lưu trữ các ID sản phẩm đang được chọn
    let selectedItemsSet = new Set();

    // Hàm helper để định dạng số thành chuỗi tiền tệ Việt Nam (vd: 50000 -> 50.000 ₫)
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };


    // === BƯỚC 2: CÁC HÀM XỬ LÝ GIAO DIỆN (RENDER) ===

    /**
     * Hàm này chịu trách nhiệm vẽ lại danh sách các sản phẩm trong giỏ hàng.
     * @param {Array} items - Mảng các sản phẩm từ API giỏ hàng.
     */
    function renderCartItems(items) {
        cartItemsContainer.innerHTML = ''; // Luôn xóa nội dung cũ trước khi vẽ lại.

        if (!items || items.length === 0) {
            cartItemsContainer.innerHTML = '<tr><td colspan="6" class="text-center p-5"><p>Giỏ hàng của bạn đang trống.</p><a href="/products" class="btn btn-primary">Tiếp tục mua sắm</a></td></tr>';
            // Disable bulk controls
            if (selectAllCheckbox) selectAllCheckbox.disabled = true;
            if (deleteSelectedBtn) deleteSelectedBtn.disabled = true;
            return;
        }

        // Enable bulk controls
        if (selectAllCheckbox) {
            selectAllCheckbox.disabled = false;
            // Kiểm tra xem TẤT CẢ items trong GIỎ HÀNG (global) có được chọn hết không
            const allGlobalIds = globalItemSummaries.map(s => s.id.toString());
            const allSelectedGlobally = allGlobalIds.length > 0 && allGlobalIds.every(id => selectedItemsSet.has(id));
            selectAllCheckbox.checked = allSelectedGlobally;
        }
        if (deleteSelectedBtn) deleteSelectedBtn.disabled = true;

        items.forEach(item => {
            const itemTotal = item.so_luong * item.product.gia_bia;
            const isChecked = selectedItemsSet.has(item.id.toString()); // Convert id to string for consistency

            const cartItemHTML = `
                <tr class="cart-item-row" data-id="${item.id}" data-price="${item.product.gia_bia}" data-quantity="${item.so_luong}">
                    <td class="text-center">
                        <input class="form-check-input item-checkbox" type="checkbox" value="${item.id}" ${isChecked ? 'checked' : ''} ${item.product.so_luong_ton_kho <= 0 ? 'disabled' : ''}>
                    </td>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${item.product.img || '/images/placeholder.png'}" alt="" style="width: 70px; height: 100px; object-fit: cover" class="rounded-3"/>
                            <div class="ms-3">
                                <p class="fw-bold mb-1">${item.product.ten_sach}</p>
                                <small class="text-muted">Kho: ${item.product.so_luong_ton_kho}</small>
                            </div>
                        </div>
                    </td>
                    <td>
                        <p class="fw-normal mb-1">${parseFloat(item.product.gia_bia).toLocaleString('vi-VN')}đ</p>
                    </td>
                    <td>
                        ${item.product.so_luong_ton_kho > 0 ? `
                        <div class="input-group input-group-sm" style="width: 120px;">
                            <button class="btn btn-outline-secondary btn-decrease-qty" type="button" data-item-id="${item.id}">-</button>
                            <input type="number" class="form-control text-center item-quantity" value="${item.so_luong}" 
                                min="1" max="${item.product.so_luong_ton_kho}" data-item-id="${item.id}">
                            <button class="btn btn-outline-secondary btn-increase-qty" type="button" data-item-id="${item.id}">+</button>
                        </div>
                        ` : `<span class="text-danger fw-bold">Hết hàng</span>`}
                    </td>
                    <td>
                        <p class="fw-bold mb-1 item-total-display">${itemTotal.toLocaleString('vi-VN')}đ</p>
                    </td>
                    <td>
                        <button class="btn btn-link text-danger p-0 remove-item-btn" data-item-id="${item.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        });

        // Sau khi vẽ xong, gắn lại các event listener cho các nút vừa tạo.
        addEventListenersToCartItems();
        updateBulkActionState(); // Cập nhật trạng thái nút xóa
        updateOrderSummary();   // Tính toán lại tiền
    }

    /**
     * Hàm tính tổng tiền dựa trên các item ĐANG ĐƯỢC CHỌN (trong selectedItemsSet)
     * Sử dụng globalItemSummaries để tính cho TẤT CẢ các trang.
     */
    function calculateSelectedSubtotal() {
        let subtotal = 0;

        globalItemSummaries.forEach(item => {
            if (selectedItemsSet.has(item.id.toString())) {
                subtotal += item.price * item.quantity;
            }
        });

        return subtotal;
    }

    /**
     * Hàm này chịu trách nhiệm cập nhật lại toàn bộ phần "Tóm tắt đơn hàng".
     * Nó sẽ được gọi mỗi khi có thay đổi trong giỏ hàng hoặc áp dụng khuyến mãi.
     */
    function updateOrderSummary() {
        // Tính Subtotal dựa trên SELECTION
        const subtotal = calculateSelectedSubtotal();

        const shippingFee = (subtotal > 0 && subtotal < 300000) ? 30000 : 0; // Miễn phí giao hàng từ 300k

        // Cập nhật giao diện
        subtotalEl.textContent = formatCurrency(subtotal);
        shippingFeeEl.textContent = formatCurrency(shippingFee);

        // Xử lý hiển thị dòng giảm giá
        if (currentDiscountAmount > 0 && subtotal > 0) {
            // Nếu subtotal < discount thì sao? Thường discount ko được quá subtotal
            // Ở đây cứ hiển thị, việc tính toán fix âm ở dưới
            discountAmountEl.textContent = `- ${formatCurrency(currentDiscountAmount)}`;
            discountRow.style.display = 'flex';
        } else {
            discountRow.style.display = 'none';
        }

        // Tính tổng tiền cuối cùng và đảm bảo không bị âm
        let finalTotal = subtotal + shippingFee - currentDiscountAmount;
        if (finalTotal < 0) finalTotal = 0;

        // Nếu không chọn gì cả, final = 0
        if (subtotal === 0) finalTotal = 0;

        finalTotalEl.textContent = formatCurrency(finalTotal);
    }

    // === BƯỚC 3: CÁC HÀM GỌI API (TƯƠNG TÁC VỚI SERVER) ===

    /**
     * Hàm chính: Lấy dữ liệu giỏ hàng từ server và khởi chạy quá trình render.
     */
    async function fetchAndRenderCart(page = 1) {
        try {
            const response = await fetch(`/api/cart?page=${page}&limit=5`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
                throw new Error('Không thể tải giỏ hàng từ server.');
            }

            const cartResponse = await response.json();

            currentCart = { items: cartResponse.items };
            // Cập nhật registry global để tính tiền chính xác
            globalItemSummaries = cartResponse.allItemSummaries || [];

            renderCartItems(cartResponse.items);
            // updateOrderSummary(); // Đã gọi trong renderCartItems

            // MỚI: Render phân trang
            renderPagination(cartResponse.pagination);

        } catch (error) {
            console.error('Lỗi khi fetch giỏ hàng:', error);
            cartItemsContainer.innerHTML = `<p class="text-center text-danger">${error.message}</p>`;
        }
    }

    /**
     * Hàm render thanh phân trang
     */
    function renderPagination(pagination) {
        const paginationContainer = document.getElementById('cart-pagination');
        if (!paginationContainer) return;

        if (!pagination || pagination.totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let html = '';

        // Nút Previous
        html += `<li class="page-item ${pagination.currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${pagination.currentPage - 1}">&laquo;</a>
                 </li>`;

        // Các trang
        for (let i = 1; i <= pagination.totalPages; i++) {
            html += `<li class="page-item ${i === pagination.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                     </li>`;
        }

        // Nút Next
        html += `<li class="page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${pagination.currentPage + 1}">&raquo;</a>
                 </li>`;

        paginationContainer.innerHTML = html;

        // Gắn sự kiện click
        paginationContainer.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const newPage = parseInt(e.target.dataset.page);
                if (newPage > 0 && newPage <= pagination.totalPages && newPage !== pagination.currentPage) {
                    fetchAndRenderCart(newPage);
                }
            });
        });
    }

    /**
     * Gọi API để xóa một sản phẩm khỏi giỏ hàng.
     * @param {string|number} itemId - ID của sản phẩm trong giỏ hàng.
     * @param {boolean} reload - Có reload lại giỏ hay không (mặc định có)
     */
    async function removeItemFromCart(itemId, reload = true) {
        try {
            const response = await fetch(`/api/cart/items/${itemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                if (reload) fetchAndRenderCart();
                return true;
            } else {
                if (reload) alert('Xóa sản phẩm thất bại. Vui lòng thử lại.');
                return false;
            }
        } catch (error) {
            console.error('Lỗi API khi xóa sản phẩm:', error);
            return false;
        }
    }

    /**
     * Gọi API để cập nhật số lượng của một sản phẩm.
     */
    async function updateCartItemQuantity(itemId, quantity) {
        try {
            const response = await fetch(`/api/cart/items/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ soLuong: quantity })
            });
            if (response.ok) {
                // Sau khi update quantity, giá tiền thay đổi -> gọi lại render để update UI và subtotal
                fetchAndRenderCart();
            } else {
                alert('Cập nhật số lượng thất bại. Vui lòng thử lại.');
                fetchAndRenderCart();
            }
        } catch (error) {
            console.error('Lỗi API khi cập nhật số lượng:', error);
        }
    }


    // === BƯỚC 4: GẮN CÁC BỘ LẮNG NGHE SỰ KIỆN (EVENT LISTENERS) ===

    function updateBulkActionState() {
        // checkedCount ở đây chỉ là số item ĐANG HIỂN THỊ trên trang này mà được chọn
        // Dùng để update text "Xóa đã chọn (N)"
        const checkedOnPageCount = document.querySelectorAll('.item-checkbox:checked').length;

        // NHƯNG để update nút xóa có disabled hay không và text chính xác, 
        // ta nên dựa vào selectedItemsSet.size (toàn bộ các trang)
        const totalSelectedCount = selectedItemsSet.size;

        if (deleteSelectedBtn) {
            deleteSelectedBtn.disabled = totalSelectedCount === 0;
            deleteSelectedBtn.innerHTML = `<i class="fas fa-trash-alt me-1"></i> Xóa đã chọn (${totalSelectedCount})`;
        }

        // Kiểm tra xem ĐÃ CHỌN TẤT CẢ (global) chưa để update Select All checkbox
        if (selectAllCheckbox && globalItemSummaries.length > 0) {
            selectAllCheckbox.checked = (totalSelectedCount === globalItemSummaries.length);
        }
    }

    /**
     * Gắn các sự kiện cho các nút trong giỏ hàng.
     */
    function addEventListenersToCartItems() {
        // 1. Sự kiện xóa từng món
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const buttonElement = event.target.closest('button');
                const itemId = buttonElement.dataset.itemId;

                Swal.fire({
                    title: 'Bạn chắc chắn?',
                    text: "Bạn sẽ không thể hoàn tác hành động này!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Vâng, xóa nó!',
                    cancelButtonText: 'Hủy'
                }).then((result) => {
                    if (result.isConfirmed) {
                        removeItemFromCart(itemId);
                    }
                })
            });
        });


        // 2. Sự kiện thay đổi số lượng (Input nhập trực tiếp)
        document.querySelectorAll('.item-quantity').forEach(input => {
            input.addEventListener('change', (event) => {
                const itemId = event.target.dataset.itemId;
                let newQuantity = parseInt(event.target.value, 10);
                const maxStock = parseInt(event.target.getAttribute('max'), 10);

                // Validate
                if (isNaN(newQuantity) || newQuantity < 1) {
                    newQuantity = 1;
                } else if (newQuantity > maxStock) {
                    newQuantity = maxStock;
                    Swal.fire({
                        icon: 'warning',
                        title: 'Số lượng vượt quá tồn kho',
                        text: `Sản phẩm này chỉ còn ${maxStock} sản phẩm trong kho.`,
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000
                    });
                }

                // Cập nhật lại giá trị vào input trươc khi gửi (để UX đúng)
                event.target.value = newQuantity;

                // updateCartItemQuantity sẽ render lại nên không cần lo lắng quá về UI state ở đây
                updateCartItemQuantity(itemId, newQuantity);
            });
        });

        // 2b. Sự kiện nút Tăng/Giảm
        document.querySelectorAll('.btn-decrease-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId;
                const row = e.target.closest('tr'); // Hoặc tìm input bằng cách khác
                // Vì cấu trúc HTML là button -> input -> button trong cùng div, ta có thể tìm sibling
                const input = e.target.parentElement.querySelector('.item-quantity');
                let currentQty = parseInt(input.value, 10);

                if (currentQty > 1) {
                    updateCartItemQuantity(itemId, currentQty - 1);
                }
            });
        });

        document.querySelectorAll('.btn-increase-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId;
                const input = e.target.parentElement.querySelector('.item-quantity');
                let currentQty = parseInt(input.value, 10);
                const maxStock = parseInt(input.getAttribute('max'), 10);

                if (currentQty < maxStock) {
                    updateCartItemQuantity(itemId, currentQty + 1);
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Đạt giới hạn tồn kho',
                        text: `Bạn chỉ có thể mua tối đa ${maxStock} sản phẩm.`,
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
            });
        });

        // 3. Sự kiện check từng item
        document.querySelectorAll('.item-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const itemId = checkbox.value.toString();
                if (checkbox.checked) {
                    selectedItemsSet.add(itemId);
                } else {
                    selectedItemsSet.delete(itemId);
                }

                // Update Select All checkbox state
                updateBulkActionState();
                // Update Total Money
                updateOrderSummary();
            });
        });
    }

    // LISTENER CHO BULK ACTIONS (Footer)
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;

            if (isChecked) {
                // Thêm TẤT CẢ item IDs từ global registry vào Set
                globalItemSummaries.forEach(item => {
                    selectedItemsSet.add(item.id.toString());
                });
            } else {
                // Xóa TẤT CẢ (hoặc chỉ xóa những item global đang có?)
                // Thường "bỏ chọn tất cả" là reset Set
                selectedItemsSet.clear();
            }

            // Sync UI checkboxes trên trang hiện tại
            const checkboxes = document.querySelectorAll('.item-checkbox');
            checkboxes.forEach(cb => {
                cb.checked = isChecked;
            });

            updateBulkActionState();
            updateOrderSummary();
        });
    }

    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener('click', () => {
            const selectedIds = Array.from(selectedItemsSet);
            if (selectedIds.length === 0) return;

            Swal.fire({
                title: 'Xóa nhiều sản phẩm?',
                text: `Bạn có chắc muốn xóa ${selectedIds.length} sản phẩm đã chọn?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonText: 'Hủy',
                confirmButtonText: 'Xóa tất cả'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // Xóa lần lượt (hoặc dùng API bulk delete nếu có)
                    // Hiện tại chưa có API bulk delete, loop xóa từng cái
                    // Để tránh reload nhiều lần, ta sẽ set reload=false và reload cuối cùng
                    let successCount = 0;
                    for (const id of selectedIds) {
                        const success = await removeItemFromCart(id, false);
                        if (success) successCount++;
                    }
                    // Reload cart
                    fetchAndRenderCart();
                    Swal.fire('Đã xóa!', `Đã xóa ${successCount} sản phẩm.`, 'success');
                }
            });
        });
    }

    // Gắn sự kiện cho nút "Áp dụng" mã khuyến mãi
    if (applyBtn) {
        applyBtn.addEventListener('click', async () => {
            const promoCode = promoInput.value.trim().toUpperCase();
            if (!promoCode) {
                promoTextMessage.textContent = 'Vui lòng nhập mã khuyến mãi.';
                promoMessage.className = 'mt-2 small d-flex align-items-center text-danger';
                removePromoBtn.style.display = 'none';
                return;
            }

            // Validate: Phải có ít nhất 1 sản phẩm được chọn mới cho áp dụng
            const selectedSubtotal = calculateSelectedSubtotal();
            if (selectedSubtotal === 0) {
                promoTextMessage.textContent = 'Vui lòng chọn ít nhất một sản phẩm để áp dụng mã.';
                promoMessage.className = 'mt-2 small d-flex align-items-center text-danger';
                return;
            }

            // Vô hiệu hóa nút và hiển thị spinner để người dùng biết đang xử lý
            applyBtn.disabled = true;
            applyBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';

            try {
                // Gửi subtotal của CÁC ITEM ĐƯỢC CHỌN lên server để tính discount
                const response = await fetch('/api/promotions/apply', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({
                        ma_khuyen_mai: promoCode,
                        currentSubtotal: selectedSubtotal
                    })
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message || 'Có lỗi không xác định.');

                // XỬ LÝ KHI ÁP DỤNG THÀNH CÔNG
                promoTextMessage.textContent = result.message;
                promoMessage.className = 'mt-2 small d-flex align-items-center text-success';
                removePromoBtn.style.display = 'inline'; // HIỆN NÚT HỦY

                currentDiscountAmount = result.discountAmount; // Lưu lại số tiền được giảm
                sessionStorage.setItem('discountAmountApplied', currentDiscountAmount);
                updateOrderSummary(); // Cập nhật lại toàn bộ phần tóm tắt

            } catch (error) {
                // XỬ LÝ KHI ÁP DỤNG THẤT BẠI
                promoTextMessage.textContent = error.message;
                promoMessage.className = 'mt-2 small d-flex align-items-center text-danger';
                removePromoBtn.style.display = 'none'; // ẨN NÚT HỦY

                currentDiscountAmount = 0;
                sessionStorage.removeItem('discountAmountApplied');
                updateOrderSummary();
            } finally {
                // Luôn kích hoạt lại nút sau khi xử lý xong, dù thành công hay thất bại
                applyBtn.disabled = false;
                applyBtn.innerHTML = 'Áp dụng';
            }
        });
    }
    // <<< THÊM SỰ KIỆN CLICK CHO NÚT HỦY MỚI >>>
    if (removePromoBtn) {
        removePromoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // 1. Reset các biến và ô input
            promoInput.value = '';
            currentDiscountAmount = 0;
            // 2. Xóa thông báo và ẩn nút Hủy
            promoTextMessage.textContent = '';
            promoMessage.className = 'mt-2 small d-flex align-items-center';
            removePromoBtn.style.display = 'none';
            // 3. Xóa dữ liệu khuyến mãi khỏi sessionStorage
            sessionStorage.removeItem('promoCodeToCheckout');
            sessionStorage.removeItem('discountAmountApplied');
            // 4. Cập nhật lại giao diện
            updateOrderSummary();
        });
    }
    const checkoutButton = document.querySelector('a[href="/checkout"]');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', (e) => {
            // Validate: Phải chọn ít nhất 1 sản phẩm
            const selectedCount = document.querySelectorAll('.item-checkbox:checked').length;
            if (selectedCount === 0) {
                e.preventDefault(); // Chặn chuyển trang
                Swal.fire({
                    icon: 'warning',
                    title: 'Chưa chọn sản phẩm',
                    text: 'Vui lòng chọn ít nhất một sản phẩm để thanh toán.'
                });
                return;
            }

            const promoCode = promoInput.value.trim().toUpperCase();
            if (promoCode && currentDiscountAmount > 0) { // Thêm điều kiện: phải có giảm giá thực tế
                sessionStorage.setItem('promoCodeToCheckout', promoCode);
                // Số tiền giảm đã được lưu khi nhấn "Áp dụng", không cần lưu lại ở đây
            } else {
                // Nếu không có mã hoặc mã không hợp lệ, xóa sạch
                sessionStorage.removeItem('promoCodeToCheckout');
                sessionStorage.removeItem('discountAmountApplied');
            }

            // LƯU Ý: Ở bước này, code backend checkout cần biết user mua những item nào.
            // "chỉ khi được chọn thì sản phẩm đó mới được tính vào hóa đơn" -> Hàm ý quan trọng.
            const selectedIds = Array.from(selectedItemsSet);
            sessionStorage.setItem('selectedCartItemIds', JSON.stringify(selectedIds));
        });
    }

    const promoModal = document.getElementById('promo-modal');
    if (promoModal) {
        const promoListContainer = document.getElementById('promo-list-container');
        const selectPromoBtn = document.getElementById('select-promo-btn');
        const promoCodeInput = document.getElementById('promo-code-input');
        const applyPromoBtn = document.getElementById('apply-promo-btn');
        const token = localStorage.getItem('token');
        // Biến để lưu mã KM đang được chọn trong modal
        let selectedPromoCode = null;

        // Sự kiện được kích hoạt ngay khi modal bắt đầu mở ra
        promoModal.addEventListener('show.bs.modal', async () => {
            // Reset trạng thái
            selectedPromoCode = null;
            promoListContainer.innerHTML = '<p class="text-center">Đang tìm các ưu đãi tốt nhất...</p>';

            // Lấy tổng tiền tạm tính hiện tại của giỏ hàng (THEO SELECTION)
            const subtotalText = document.getElementById('cart-subtotal').textContent;
            const subtotal = parseFloat(subtotalText.replace(/[^0-9]/g, ''));

            try {
                // Gọi API mới để lấy các mã KM hợp lệ
                const response = await fetch(`/api/promotions/available?subtotal=${subtotal}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Không thể tải ưu đãi.');

                const promos = await response.json();

                // Render danh sách KM vào modal
                promoListContainer.innerHTML = '';
                if (promos.length === 0) {
                    promoListContainer.innerHTML = '<p class="text-center text-muted">Rất tiếc, chưa có ưu đãi nào phù hợp cho giỏ hàng của bạn.</p>';
                    return;
                }

                promos.forEach(promo => {
                    const discountText = promo.loai_giam_gia === 'percentage'
                        ? `Giảm ${parseInt(promo.gia_tri_giam)}%`
                        : `Giảm ${parseInt(promo.gia_tri_giam).toLocaleString('vi-VN')}đ`;

                    // Tạo từng item khuyến mãi
                    const promoItemHTML = `
                    <div class="promo-item border rounded p-3 mb-2" style="cursor: pointer;" data-code="${promo.ma_khuyen_mai}">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-1 text-success">${discountText}</h6>
                                <small class="text-muted d-block">${promo.mo_ta}</small>
                            </div>
                            <i class="far fa-circle promo-check-icon fs-4 text-muted"></i>
                        </div>
                    </div>
                `;
                    promoListContainer.insertAdjacentHTML('beforeend', promoItemHTML);
                });

            } catch (error) {
                promoListContainer.innerHTML = `<p class="text-center text-danger">${error.message}</p>`;
            }
        });

        // Xử lý sự kiện khi click chọn một mã KM trong modal
        promoListContainer.addEventListener('click', (e) => {
            const selectedItem = e.target.closest('.promo-item');
            if (!selectedItem) return;

            // Bỏ chọn tất cả các item khác (reset giao diện)
            document.querySelectorAll('.promo-item').forEach(item => {
                item.classList.remove('border-primary', 'bg-light');
                item.querySelector('.promo-check-icon').className = 'far fa-circle promo-check-icon fs-4 text-muted';
            });

            // Đánh dấu item được chọn
            selectedItem.classList.add('border-primary', 'bg-light');
            selectedItem.querySelector('.promo-check-icon').className = 'fas fa-check-circle promo-check-icon fs-4 text-primary';

            // Lưu lại mã đã chọn
            selectedPromoCode = selectedItem.dataset.code;
        });

        // Xử lý sự kiện khi nhấn nút "Áp dụng mã đã chọn"
        selectPromoBtn.addEventListener('click', () => {
            if (selectedPromoCode) {
                // Điền mã đã chọn vào ô input
                promoCodeInput.value = selectedPromoCode;
                // Tự động nhấn nút "Áp dụng" để tái sử dụng logic có sẵn
                applyPromoBtn.click();
            }
            // Đóng modal
            const modalInstance = bootstrap.Modal.getInstance(promoModal);
            modalInstance.hide();
        });
    }

    // === BƯỚC 5: KHỞI CHẠY ===
    // Gọi hàm này lần đầu tiên để tải và hiển thị giỏ hàng khi người dùng truy cập trang.
    fetchAndRenderCart();
});


// Hàm này có thể được gọi từ các trang khác (ví dụ: trang chi tiết sản phẩm)
// nên nó được đặt bên ngoài 'DOMContentLoaded'.
async function addToCart(productId, quantity = 1) {
    const token = localStorage.getItem('token');
    if (!token) {
        Swal.fire({
            icon: 'warning',
            title: 'Vui lòng đăng nhập',
            text: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.',
            showCancelButton: true,
            confirmButtonText: 'Đăng nhập ngay',
            cancelButtonText: 'Để sau'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/login';
            }
        });
        return;
    }

    try {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId: productId, soLuong: quantity })
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Đã thêm sản phẩm vào giỏ hàng.',
                showConfirmButton: false,
                timer: 1500,
                toast: true,
                position: 'top-end'
            });
        } else {
            const data = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Thất bại...',
                text: data.message || 'Không thể thêm sản phẩm vào giỏ hàng.'
            });
        }
    } catch (error) {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi kết nối',
            text: 'Không thể kết nối đến máy chủ.'
        });
    }
}