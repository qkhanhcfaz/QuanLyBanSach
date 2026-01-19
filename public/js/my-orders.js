// File: /public/js/my-orders.js

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    // Nếu chưa đăng nhập, chuyển hướng
    if (!token) {
        window.location.href = '/login';
        return;
    }

    const ordersContainer = document.getElementById('orders-container');
    const statusTabs = document.querySelectorAll('#orderStatusTabs button');

    let allOrders = []; // Lưu trữ tất cả đơn hàng để filter local

    // Hàm để fetch và render lịch sử đơn hàng
    async function fetchAndRenderOrders() {
        try {
            const response = await fetch('/api/orders/myorders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
                throw new Error('Không thể tải đơn hàng của bạn.');
            }

            allOrders = await response.json();
            renderOrders(allOrders); // Mặc định hiện tất cả

        } catch (error) {
            console.error('Lỗi:', error);
            ordersContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
        }
    }

    // Lắng nghe sự kiện chuyển tab
    statusTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const status = tab.getAttribute('data-status');
            if (status === 'all') {
                renderOrders(allOrders);
            } else {
                const filteredOrders = allOrders.filter(order => order.trang_thai_don_hang === status);
                renderOrders(filteredOrders, status);
            }
        });
    });

    // Hàm để render giao diện
    function renderOrders(orders, statusLabel = 'all') {
        if (!orders || orders.length === 0) {
            let message = 'Bạn chưa có đơn hàng nào.';
            if (statusLabel !== 'all') {
                const statusName = document.querySelector(`[data-status="${statusLabel}"]`).textContent;
                message = `Không có đơn hàng nào trong trạng thái "${statusName}".`;
            }
            ordersContainer.innerHTML = `<div class="text-center py-5"><p class="text-muted">${message}</p></div>`;
            return;
        }

        let ordersHTML = `
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th scope="col">Mã ĐH</th>
                            <th scope="col">Ngày Đặt</th>
                            <th scope="col">Tổng Tiền</th>
                            <th scope="col">Trạng thái ĐH</th>
                            <th scope="col">Thanh toán</th>
                            <th scope="col" class="text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        orders.forEach(order => {
            const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN');
            const totalAmount = parseFloat(order.tong_thanh_toan).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
            // Lấy thông tin trạng thái đơn hàng (text và class)
            const statusInfo = getStatusInfo(order.trang_thai_don_hang);
            // <<< LẤY THÔNG TIN TRẠNG THÁI THANH TOÁN >>>
            const paymentStatusInfo = getPaymentStatusInfo(order.trang_thai_thanh_toan);

            const statusBadgeHTML = `<span class="badge rounded-pill ${statusInfo.className}">${statusInfo.text}</span>`;
            // <<< TẠO BADGE CHO TRẠNG THÁI THANH TOÁN >>>
            const paymentBadgeHTML = `<span class="badge rounded-pill ${paymentStatusInfo.className}">${paymentStatusInfo.text}</span>`;

            // Nút hủy đơn (chỉ hiện khi pending)
            const cancelButtonHTML = order.trang_thai_don_hang === 'pending'
                ? `<button class="btn btn-sm btn-outline-danger ms-1 cancel-order-btn" data-id="${order.id}">Hủy đơn</button>`
                : '';

            // Nút mua lại (chỉ hiện khi cancelled)
            const reorderButtonHTML = order.trang_thai_don_hang === 'cancelled'
                ? `<button class="btn btn-sm btn-outline-success ms-1 reorder-btn" data-id="${order.id}">Mua lại</button>`
                : '';

            ordersHTML += `
                <tr>
                    <th scope="row">#${order.id}</th>
                    <td>${orderDate}</td>
                    <td><span class="text-danger fw-bold">${totalAmount}</span></td>
                    <td>${statusBadgeHTML}</td> 
                    <td>${paymentBadgeHTML}</td>
                    <td class="text-center">
                        <a href="/orders/${order.id}" class="btn btn-sm btn-outline-primary">Xem chi tiết</a>
                        ${cancelButtonHTML}
                        ${reorderButtonHTML}
                    </td>
                </tr>
            `;
        });

        ordersHTML += `
                </tbody>
            </table>
        </div>
        `;
        ordersContainer.innerHTML = ordersHTML;

        // Thêm event listener cho các nút hủy
        document.querySelectorAll('.cancel-order-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const orderId = btn.getAttribute('data-id');

                const result = await Swal.fire({
                    title: 'Xác nhận hủy đơn',
                    text: `Bạn có chắc chắn muốn hủy đơn hàng #${orderId} không?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Đồng ý hủy',
                    cancelButtonText: 'Quay lại'
                });

                if (result.isConfirmed) {
                    await handleCancelOrder(orderId);
                }
            });
        });

        // Thêm event listener cho các nút mua lại
        document.querySelectorAll('.reorder-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const orderId = btn.getAttribute('data-id');

                const result = await Swal.fire({
                    title: 'Xác nhận mua lại',
                    text: `Bạn có muốn mua lại đơn hàng #${orderId} không?`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#198754',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Đồng ý',
                    cancelButtonText: 'Hủy'
                });

                if (result.isConfirmed) {
                    await handleReorder(orderId);
                }
            });
        });
    }

    // Hàm xử lý mua lại đơn hàng
    async function handleReorder(orderId) {
        try {
            const response = await fetch(`/api/orders/${orderId}/reorder`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: result.message,
                    timer: 2000,
                    showConfirmButton: false
                });
                fetchAndRenderOrders();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: result.message || 'Đặt lại đơn hàng thất bại.'
                });
            }
        } catch (error) {
            console.error('Lỗi khi mua lại đơn hàng:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi kết nối',
                text: 'Mất kết nối server. Vui lòng thử lại sau.'
            });
        }
    }

    // Hàm xử lý hủy đơn hàng
    async function handleCancelOrder(orderId) {
        try {
            const response = await fetch(`/api/orders/${orderId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: result.message,
                    timer: 2000,
                    showConfirmButton: false
                });
                // Refresh lại danh sách
                fetchAndRenderOrders();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: result.message || 'Hủy đơn hàng thất bại.'
                });
            }
        } catch (error) {
            console.error('Lỗi khi hủy đơn hàng:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi kết nối',
                text: 'Mất kết nối server. Vui lòng thử lại sau.'
            });
        }
    }


    // Hàm để lấy class CSS cho từng trạng thái
    function getStatusInfo(status) {
        switch (status) {
            case 'pending':
                return { text: 'Chờ xác nhận', className: 'bg-secondary' };
            case 'confirmed':
                return { text: 'Đã xác nhận', className: 'bg-primary' };
            case 'shipping':
                return { text: 'Đang giao', className: 'bg-info text-dark' };
            case 'delivered':
                return { text: 'Đã giao', className: 'bg-success' };
            case 'cancelled':
                return { text: 'Đã hủy', className: 'bg-danger' };
            default:
                return { text: status, className: 'bg-light text-dark' };
        }
    }
    // <<< THÊM HÀM MỚI ĐỂ XỬ LÝ TRẠNG THÁI THANH TOÁN >>>
    function getPaymentStatusInfo(isPaid) {
        if (isPaid) { // isPaid là true
            return { text: 'Đã thanh toán', className: 'bg-success' };
        } else { // isPaid là false
            return { text: 'Chưa thanh toán', className: 'bg-warning text-dark' };
        }
    }

    // Chạy hàm fetch lần đầu
    fetchAndRenderOrders();
});