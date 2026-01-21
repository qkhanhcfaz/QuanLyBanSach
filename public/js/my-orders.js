// File: /public/js/my-orders.js

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    // Nếu chưa đăng nhập, chuyển hướng
    if (!token) {
        window.location.href = '/login';
        return;
    }

    const ordersContainer = document.getElementById('orders-container');
    const paginationContainer = document.getElementById('pagination-container');
    const statusTabs = document.querySelectorAll('#order-status-tabs .nav-link');

    let currentFilter = 'all';
    let currentPage = 1;

    // Xử lý sự kiện click vào Tab
    statusTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();

            // Cập nhật UI Active tab
            statusTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Cập nhật Filter và Reset trang về 1
            currentFilter = tab.getAttribute('data-status');
            currentPage = 1;
            fetchAndRenderOrders(currentPage, currentFilter);
        });
    });

    // Hàm để fetch và render lịch sử đơn hàng
    async function fetchAndRenderOrders(page = 1, status = 'all') {
        try {
            ordersContainer.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Đang tải đơn hàng...</p></div>';

            const response = await fetch(`/api/orders/myorders?page=${page}&limit=5&status=${status}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
                throw new Error('Không thể tải các đơn hàng.');
            }

            const data = await response.json();

            renderOrders(data.orders);
            renderPagination(data.pagination);

        } catch (error) {
            console.error('Lỗi:', error);
            ordersContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
            paginationContainer.innerHTML = '';
        }
    }

    // Hàm để render giao diện
    function renderOrders(orders) {
        if (!orders || orders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="text-center p-5 border rounded bg-light">
                    <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                    <p class="lead text-muted">Không tìm thấy đơn hàng nào ở trạng thái này.</p>
                </div>
            `;
            return;
        }

        let ordersHTML = `
            <div class="table-responsive shadow-sm rounded">
                <table class="table table-hover align-middle mb-0 bg-white">
                    <thead class="table-light">
                        <tr>
                            <th scope="col" class="ps-3">Mã ĐH</th>
                            <th scope="col">Ngày Đặt</th>
                            <th scope="col">Tổng Tiền</th>
                            <th scope="col">Trạng thái ĐH</th>
                            <th scope="col">Thanh toán</th>
                            <th scope="col" class="text-center pe-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        orders.forEach(order => {
            const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN');
            const totalAmount = parseFloat(order.tong_thanh_toan).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

            const statusInfo = getStatusInfo(order.trang_thai_don_hang);
            const paymentStatusInfo = getPaymentStatusInfo(order.trang_thai_thanh_toan);

            ordersHTML += `
                <tr>
                    <td class="ps-3 fw-bold text-primary">#${order.id}</td>
                    <td>${orderDate}</td>
                    <td>${totalAmount}</td>
                    <td><span class="badge rounded-pill ${statusInfo.className}">${statusInfo.text}</span></td> 
                    <td><span class="badge rounded-pill ${paymentStatusInfo.className}">${paymentStatusInfo.text}</span></td>
                    <td class="text-center pe-3">
                        <div class="d-flex justify-content-center gap-2">
                            <a href="/orders/${order.id}" class="btn btn-sm btn-outline-info">Chi tiết</a>
                            ${(order.trang_thai_don_hang === 'pending' || order.trang_thai_don_hang === 'pending_payment') ?
                    `<button onclick="cancelOrder('${order.id}')" class="btn btn-sm btn-outline-danger">Hủy đơn</button>` : ''}
                            ${order.trang_thai_don_hang === 'cancelled' ? `
                                    <button class="btn btn-outline-primary btn-sm" onclick="reorder('${order.id}')">
                                        <i class="fas fa-redo me-1"></i> Mua lại
                                    </button>
                                ` : ""
                }
                        </div>
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
    }

    // Hàm Hủy đơn hàng
    window.cancelOrder = async function (orderId) {
        const result = await Swal.fire({
            title: 'Xác nhận hủy đơn',
            text: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Có, hủy ngay!',
            cancelButtonText: 'Quay lại'
        });

        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`/api/orders/${orderId}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Đã hủy!',
                    text: 'Hủy đơn hàng thành công.',
                    timer: 2000,
                    showConfirmButton: false
                });
                // Reload lại danh sách hiện tại
                fetchAndRenderOrders(currentPage, currentFilter);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Thất bại',
                    text: data.message || 'Có lỗi xảy ra khi hủy đơn hàng.'
                });
            }
        } catch (error) {
            console.error('Lỗi hủy đơn:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi kết nối',
                text: 'Không thể kết nối tới máy chủ.'
            });
        }
    }

    // --- HÀM MUA LẠI ĐƠN HÀNG ---
    window.reorder = async function (orderId) {
        const result = await Swal.fire({
            title: 'Xác nhận mua lại',
            text: "Đơn hàng này sẽ được đặt lại ngay lập tức.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0d6efd',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Đồng ý đặt lại',
            cancelButtonText: 'Hủy'
        });

        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`/api/orders/${orderId}/reorder`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Đơn hàng của bạn đã được đặt lại thành công.',
                    timer: 1500,
                    showConfirmButton: false
                });
                // Chuyển hướng đến trang chi tiết đơn hàng đó
                window.location.href = `/orders/${orderId}`;
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Thất bại',
                    text: data.message || 'Có lỗi xảy ra khi thực hiện mua lại.'
                });
            }
        } catch (error) {
            console.error('Lỗi mua lại:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi kết nối',
                text: 'Không thể kết nối tới máy chủ.'
            });
        }
    }

    function renderPagination(pagination) {
        if (!pagination || pagination.totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = `
            <li class="page-item ${pagination.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${pagination.currentPage - 1}"><i class="fas fa-chevron-left"></i></a>
            </li>
        `;

        for (let i = 1; i <= pagination.totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${pagination.currentPage === i ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        paginationHTML += `
            <li class="page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${pagination.currentPage + 1}"><i class="fas fa-chevron-right"></i></a>
            </li>
        `;

        paginationContainer.innerHTML = paginationHTML;

        // Add event listeners to pagination links
        paginationContainer.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.closest('.page-link').getAttribute('data-page'));
                if (page && page !== currentPage) {
                    currentPage = page;
                    fetchAndRenderOrders(currentPage, currentFilter);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }


    // Hàm để lấy class CSS cho từng trạng thái
    function getStatusInfo(status) {
        switch (status) {
            case 'pending':
                return { text: 'Chờ xác nhận', className: 'text-bg-secondary' };
            case 'pending_payment':
                return { text: 'Chờ thanh toán', className: 'text-bg-warning' };
            case 'confirmed':
                return { text: 'Đã xác nhận', className: 'text-bg-primary' };
            case 'shipping':
                return { text: 'Đang giao', className: 'text-bg-info' };
            case 'delivered':
                return { text: 'Hoàn thành', className: 'text-bg-success' };
            case 'cancelled':
                return { text: 'Đã hủy', className: 'text-bg-danger' };
            default:
                return { text: status, className: 'text-bg-light' };
        }
    }

    function getPaymentStatusInfo(isPaid) {
        if (isPaid) {
            return { text: 'Đã thanh toán', className: 'bg-success' };
        } else {
            return { text: 'Chưa thanh toán', className: 'bg-warning text-dark' };
        }
    }

    // Chạy hàm fetch lần đầu
    fetchAndRenderOrders(currentPage, currentFilter);
});