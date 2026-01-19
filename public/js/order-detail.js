/**
 * File: /public/js/order-detail.js
 * Chức năng: Lấy và hiển thị thông tin chi tiết của một đơn hàng.
 */

// Hàm này sẽ được chạy ngay khi trang được tải xong.
document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderOrderDetail();
});


/**
 * Hàm chính: Lấy ID đơn hàng, gọi API, và điều phối việc hiển thị.
 */
async function fetchAndRenderOrderDetail() {
    // 1. Lấy ID đơn hàng từ URL của trình duyệt
    const orderId = getOrderIdFromUrl();

    if (!orderId) {
        console.error('Không tìm thấy ID đơn hàng trong URL.');
        showError('URL không hợp lệ. Không thể tải thông tin đơn hàng.');
        return;
    }

    // 2. Gọi API backend để lấy dữ liệu chi tiết đơn hàng
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login'; // Nếu chưa đăng nhập thì không cho xem
            return;
        }

        const response = await fetch(`/api/orders/${orderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            renderOrderDetail(data);
        } else {
            showError(data.message || 'Lỗi khi tải dữ liệu đơn hàng.');
        }
    } catch (error) {
        console.error('Lỗi mạng hoặc server:', error);
        showError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    }
}


/**
 * Hàm hiển thị toàn bộ dữ liệu đơn hàng lên các thành phần HTML.
 * @param {object} data - Đối tượng JSON chứa thông tin chi tiết đơn hàng từ API.
 */
function renderOrderDetail(data) {
    const detailContent = document.getElementById('order-detail-content');
    if (detailContent) detailContent.style.display = 'block';

    // --- HIỂN THỊ THÔNG TIN CHUNG ---
    setText('order-id-header', `Chi tiết đơn hàng #${data.id}`);
    setText('order-date', new Date(data.createdAt).toLocaleDateString('vi-VN'));

    // --- XỬ LÝ VÀ HIỂN THỊ CÁC BADGE TRẠNG THÁI ---
    const orderStatusInfo = getStatusInfo(data.trang_thai_don_hang);
    const paymentStatusInfo = getPaymentStatusInfo(data.trang_thai_thanh_toan);

    const orderStatusBadgeEl = document.getElementById('order-status-badge');
    if (orderStatusBadgeEl) {
        orderStatusBadgeEl.innerHTML = `<span class="badge rounded-pill ${orderStatusInfo.className}">${orderStatusInfo.text}</span>`;
    }

    const paymentStatusBadgeEl = document.getElementById('payment-status-badge');
    if (paymentStatusBadgeEl) {
        paymentStatusBadgeEl.innerHTML = `<span class="badge rounded-pill ${paymentStatusInfo.className}">${paymentStatusInfo.text}</span>`;
    }

    // --- HIỂN THỊ THÔNG TIN NGƯỜI NHẬN ---
    setText('customer-name', data.ten_nguoi_nhan);
    setText('customer-phone', data.so_dt_nguoi_nhan); // Fix mapping
    setText('customer-address', data.dia_chi_giao_hang);

    // --- HIỂN THỊ DANH SÁCH SẢN PHẨM ---
    const itemsContainer = document.getElementById('order-items-tbody');
    itemsContainer.innerHTML = ''; // Xóa nội dung cũ

    if (data.orderItems && Array.isArray(data.orderItems) && data.orderItems.length > 0) {
        data.orderItems.forEach(item => {
            const productName = item.product ? item.product.ten_sach : 'Sản phẩm không còn tồn tại';
            const productImage = item.product && item.product.img ? item.product.img : '/images/default-book.png';
            const productPrice = formatCurrency(parseFloat(item.don_gia));
            const lineTotal = formatCurrency(parseFloat(item.so_luong_dat) * parseFloat(item.don_gia));

            const itemRowHtml = `
                <tr>
                    <td>
                        <img src="${productImage}" alt="${productName}" class="product-img-mini">
                    </td>
                    <td>
                        <div class="fw-bold text-dark mb-1">${productName}</div>
                        <div class="text-muted small">Mã sản phẩm: #${item.product_id}</div>
                    </td>
                    <td class="text-center">
                        <span class="badge bg-light text-dark border px-3 py-2">${item.so_luong_dat}</span>
                    </td>
                    <td class="text-end">${productPrice}</td>
                    <td class="text-end fw-bold text-dark">${lineTotal}</td>
                </tr>
            `;
            itemsContainer.innerHTML += itemRowHtml;
        });
    } else {
        itemsContainer.innerHTML = '<tr><td colspan="4" class="text-center py-4">Không có sản phẩm nào trong đơn hàng này.</td></tr>';
    }

    // --- HIỂN THỊ TỔNG TIỀN (BAO GỒM GIẢM GIÁ) ---
    setText('subtotal', formatCurrency(parseFloat(data.tong_tien_hang)));
    setText('shipping-fee', formatCurrency(parseFloat(data.phi_van_chuyen)));
    setText('total-price', formatCurrency(parseFloat(data.tong_thanh_toan)));

    const discountRow = document.getElementById('discount-row');
    const discountAmountEl = document.getElementById('discount-amount');

    // Fix mapping from so_tien_giam_gia to giam_gia
    if (data.giam_gia && parseFloat(data.giam_gia) > 0) {
        discountAmountEl.textContent = `- ${formatCurrency(parseFloat(data.giam_gia))}`;
        discountRow.classList.add('d-flex');
        discountRow.style.display = 'flex';
    } else {
        discountRow.classList.remove('d-flex');
        discountRow.style.display = 'none';
    }

    // Ẩn thông báo lỗi nếu tải thành công
    hideError();
}


// ===================================================================
// ===================== CÁC HÀM TIỆN ÍCH ============================
// ===================================================================

/**
 * Gán text vào một element bằng ID.
 * @param {string} id - ID của element.
 * @param {string} text - Nội dung cần gán.
 */
const setText = (id, text) => {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
};

/**
 * Lấy ID đơn hàng từ URL.
 * @returns {string|null}
 */
function getOrderIdFromUrl() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1] || null;
}

/**
 * Hiển thị thông báo lỗi trên giao diện.
 * @param {string} message - Nội dung lỗi.
 */
function showError(message) {
    const errorContainer = document.getElementById('error-message');
    const mainContent = document.querySelector('main .row');
    if (errorContainer && mainContent) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        // Ẩn nội dung chính đi khi có lỗi nghiêm trọng
        mainContent.style.display = 'none';
    }
}

/**
 * Ẩn thông báo lỗi.
 */
function hideError() {
    const errorContainer = document.getElementById('error-message');
    if (errorContainer) {
        errorContainer.style.display = 'none';
    }
}

/**
 * Định dạng một số thành chuỗi tiền tệ Việt Nam (VND).
 * @param {number} number - Số tiền.
 * @returns {string}
 */
function formatCurrency(number) {
    if (typeof number !== 'number' || isNaN(number)) {
        return '0 ₫';
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}

/**
 * "Thông dịch" trạng thái đơn hàng sang text và class CSS.
 * @param {string} status - Trạng thái từ DB.
 * @returns {{text: string, className: string}}
 */
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

/**
 * "Thông dịch" trạng thái thanh toán.
 * @param {boolean} isPaid - Trạng thái từ DB.
 * @returns {{text: string, className: string}}
 */
function getPaymentStatusInfo(isPaid) {
    if (isPaid) {
        return { text: 'Đã thanh toán', className: 'bg-success' };
    } else {
        return { text: 'Chưa thanh toán', className: 'bg-warning text-dark' };
    }
}