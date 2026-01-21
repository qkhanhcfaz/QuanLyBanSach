// File: /public/js/admin-reviews.js

document.addEventListener('DOMContentLoaded', function () {
    // ====================================================================
    // LOGIC XỬ LÝ NÚT XÓA ĐÁNH GIÁ
    // ====================================================================
    const reviewTableBody = document.getElementById('reviews-table-body');
    if (reviewTableBody) {
        // --- 1. XỬ LÝ NÚT ẨN (XÓA MỀM) ---
        reviewTableBody.addEventListener('click', async function (event) {
            const deleteButton = event.target.closest('.delete-review-btn');
            if (!deleteButton) return;

            const reviewId = deleteButton.dataset.id;

            const result = await Swal.fire({
                title: 'Ẩn đánh giá này?',
                text: `Đánh giá này sẽ không hiển thị với khách hàng nữa. Bạn có thể hiển thị lại bất cứ lúc nào.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Vâng, ẩn nó!',
                cancelButtonText: 'Hủy'
            });

            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/api/reviews/${reviewId}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    const resultData = await response.json();

                    if (response.ok) {
                        toast('Thành công', resultData.message, 'success');
                        window.location.reload();
                    } else {
                        Swal.fire('Thất bại!', resultData.message || 'Không thể ẩn đánh giá.', 'error');
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire('Lỗi kết nối!', 'Không thể kết nối đến server.', 'error');
                }
            }
        });

        // --- 2. XỬ LÝ THAY ĐỔI TRẠNG THÁI NHANH ---
        reviewTableBody.addEventListener('change', async function (event) {
            const statusSelect = event.target.closest('.status-select');
            if (!statusSelect) return;

            const reviewId = statusSelect.dataset.id;
            const newStatus = statusSelect.value === 'true';
            const oldStatus = !newStatus;

            try {
                const response = await fetch(`/api/reviews/${reviewId}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ trang_thai: newStatus })
                });

                const data = await response.json();

                if (response.ok) {
                    toast('Cập nhật', 'Đã cập nhật trạng thái đánh giá.', 'success');
                    // Cập nhật màu sắc UI
                    statusSelect.classList.remove('bg-success', 'bg-secondary');
                    statusSelect.classList.add(newStatus ? 'bg-success' : 'bg-secondary');
                } else {
                    Swal.fire('Lỗi', data.message || 'Không thể cập nhật trạng thái.', 'error');
                    statusSelect.value = String(oldStatus);
                }
            } catch (error) {
                console.error(error);
                Swal.fire('Lỗi', 'Lỗi kết nối server.', 'error');
                statusSelect.value = String(oldStatus);
            }
        });
    }

    // Modal Toast Helper
    function toast(title, text, icon) {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
    }
});
