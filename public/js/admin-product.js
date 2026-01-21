// File: /public/js/admin-product.js 

document.addEventListener('DOMContentLoaded', function () {
    // ====================================================================
    // LOGIC XỬ LÝ FORM SẮP XẾP
    // ====================================================================
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            const form = document.getElementById('sort-form');
            if (!form) {
                console.error('Không tìm thấy form#sort-form');
                return;
            }

            // Xóa các input ẩn cũ để tránh trùng lặp
            const oldSortBy = form.querySelector('input[name="sortBy"]');
            if (oldSortBy) oldSortBy.remove();
            const oldOrder = form.querySelector('input[name="order"]');
            if (oldOrder) oldOrder.remove();

            // ==========================================================
            // ================= SỬA LỖI LOGIC TÁCH CHUỖI ================
            // ==========================================================
            const selectedValue = this.value; // Ví dụ: "gia_bia_DESC"

            // Tìm vị trí của dấu gạch dưới cuối cùng
            const lastUnderscoreIndex = selectedValue.lastIndexOf('_');

            // sortByValue sẽ là phần từ đầu đến dấu gạch dưới cuối cùng
            const sortByValue = selectedValue.substring(0, lastUnderscoreIndex);

            // orderValue sẽ là phần từ sau dấu gạch dưới cuối cùng
            const orderValue = selectedValue.substring(lastUnderscoreIndex + 1);
            // ==========================================================

            // Tạo input ẩn mới cho sortBy
            const sortByInput = document.createElement('input');
            sortByInput.type = 'hidden';
            sortByInput.name = 'sortBy';
            sortByInput.value = sortByValue; // Sẽ là 'gia_bia'
            form.appendChild(sortByInput);

            // Tạo input ẩn mới cho order
            const orderInput = document.createElement('input');
            orderInput.type = 'hidden';
            orderInput.name = 'order';
            orderInput.value = orderValue; // Sẽ là 'DESC'
            form.appendChild(orderInput);

            form.submit();
        });
    }

    // ====================================================================
    // LOGIC XỬ LÝ NÚT XÓA SẢN PHẨM
    // ====================================================================
    const productTableBody = document.getElementById('products-table-body');
    if (productTableBody) {
        // --- LOGIC 1: THAY ĐỔI TRẠNG THÁI (STATUS SELECT) ---
        productTableBody.addEventListener('change', async function (event) {
            const statusSelect = event.target.closest('.status-select');
            if (!statusSelect) return;

            const productId = statusSelect.dataset.id;
            const newStatus = statusSelect.value === 'true'; // Chuyển sang Boolean
            const originalValue = !newStatus; // Giá trị cũ nếu cần rollback

            const token = localStorage.getItem('token');
            if (!token) {
                Swal.fire('Lỗi!', 'Phiên đăng nhập đã hết hạn.', 'error');
                statusSelect.value = originalValue.toString();
                return;
            }

            try {
                const response = await fetch(`/api/products/${productId}/status`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ trang_thai: newStatus })
                });

                const resultData = await response.json();

                if (response.ok) {
                    Toast.fire({
                        icon: 'success',
                        title: resultData.message || 'Cập nhật trạng thái thành công.'
                    });

                    // Cập nhật màu sắc class (bg-success vs bg-secondary)
                    statusSelect.classList.toggle('bg-success', newStatus);
                    statusSelect.classList.toggle('bg-secondary', !newStatus);
                } else {
                    // Rollback nếu có lỗi (ví dụ: đang nằm trong giỏ hàng)
                    Swal.fire('Thất bại!', resultData.message, 'error');
                    statusSelect.value = originalValue.toString();
                }
            } catch (error) {
                console.error('Lỗi khi cập nhật trạng thái:', error);
                Swal.fire('Lỗi!', 'Không thể kết nối đến máy chủ.', 'error');
                statusSelect.value = originalValue.toString();
            }
        });

        // --- LOGIC 2: XỬ LÝ NÚT ẨN (XÓA MỀM) ---
        productTableBody.addEventListener('click', async function (event) {
            const deleteButton = event.target.closest('.delete-product-btn');
            if (!deleteButton) return;

            const productId = deleteButton.dataset.id;

            const result = await Swal.fire({
                title: 'Ẩn sản phẩm này?',
                text: "Sản phẩm sẽ không hiển thị với khách hàng nhưng vẫn được lưu trong hệ thống.",
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#17a2b8',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Đồng ý Ẩn',
                cancelButtonText: 'Hủy'
            });

            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                try {
                    const response = await fetch(`/api/products/${productId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const resultData = await response.json();

                    if (response.ok) {
                        await Swal.fire('Thành công!', 'Đã ẩn sản phẩm.', 'success');
                        window.location.reload();
                    } else {
                        Swal.fire('Thất bại!', resultData.message, 'error');
                    }
                } catch (error) {
                    Swal.fire('Lỗi!', 'Lỗi kết nối server.', 'error');
                }
            }
        });
    }

    // Định nghĩa Toast cho SweetAlert2 nếu chưa có
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
});