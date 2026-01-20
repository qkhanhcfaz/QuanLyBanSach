// File: /public/js/admin-reviews.js

document.addEventListener('DOMContentLoaded', function () {
    // ====================================================================
    // LOGIC XỬ LÝ NÚT XÓA ĐÁNH GIÁ
    // ====================================================================
    const reviewTableBody = document.getElementById('reviews-table-body');
    if (reviewTableBody) {
        reviewTableBody.addEventListener('click', async function (event) {
            const deleteButton = event.target.closest('.delete-review-btn');
            if (!deleteButton) {
                return;
            }

            const reviewId = deleteButton.dataset.id;

            const result = await Swal.fire({
                title: 'Bạn có chắc chắn?',
                text: `Đánh giá này sẽ được chuyển sang trạng thái ẩn và không còn hiển thị cho khách hàng!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Vâng, ẩn nó đi!',
                cancelButtonText: 'Hủy bỏ'
            });

            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                // Lưu ý: Nếu cơ chế auth của bạn dùng cookie thì không cần header Authorization bearer
                // Nhưng code mẫu trước đó (admin-product.js) có dùng nên mình giữ lại để tham khảo.
                // Tuy nhiên, controller admin thường dùng session/cookie. 
                // Nếu fetch trả về 401 thì cần check lại authMiddleware.

                try {
                    const response = await fetch(`/api/reviews/${reviewId}`, {
                        method: 'DELETE',
                        // Nếu API yêu cầu token
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Authorization': `Bearer ${token}` 
                        }
                    });
                    const resultData = await response.json();

                    if (response.ok) {
                        await Swal.fire(
                            'Đã xóa!',
                            resultData.message || 'Đánh giá đã được xóa thành công.',
                            'success'
                        );
                        // Reload trang để cập nhật danh sách
                        window.location.reload();
                    } else {
                        Swal.fire('Thất bại!', resultData.message || 'Không thể xóa đánh giá.', 'error');
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire('Lỗi kết nối!', 'Không thể kết nối đến server.', 'error');
                }
            }
        });
    }

    // ====================================================================
    // LOGIC THAY ĐỔI TRẠNG THÁI REVIEW
    // ====================================================================
    const reviewsTableBody = document.getElementById('reviews-table-body');
    if (reviewsTableBody) {
        reviewsTableBody.addEventListener('change', async function (event) {
            const statusSelect = event.target.closest('.status-select');
            if (!statusSelect) return;

            const reviewId = statusSelect.dataset.reviewId;
            const newStatus = parseInt(statusSelect.value);
            const statusText = newStatus === 1 ? 'Hiển thị' : 'Ẩn';

            try {
                const response = await fetch(`/api/reviews/${reviewId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ trang_thai: newStatus })
                });

                const result = await response.json();

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công!',
                        text: `Đã chuyển trạng thái thành "${statusText}"`,
                        timer: 1500,
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire('Lỗi!', result.message || 'Không thể cập nhật trạng thái', 'error');
                    // Revert select to previous value
                    statusSelect.value = newStatus === 1 ? 0 : 1;
                }
            } catch (error) {
                console.error('Error updating review status:', error);
                Swal.fire('Lỗi!', 'Không thể kết nối đến server', 'error');
                // Revert select to previous value
                statusSelect.value = newStatus === 1 ? 0 : 1;
            }
        });
    }

    // ====================================================================
    // LOGIC AUTO-SUBMIT BỘ LỌC
    // ====================================================================
    const filterForm = document.getElementById('filter-form');
    if (filterForm) {
        const filterSelects = filterForm.querySelectorAll('.filter-select');
        filterSelects.forEach(select => {
            select.addEventListener('change', () => {
                filterForm.submit();
            });
        });
    }
});
