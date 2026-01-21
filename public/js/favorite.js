document.addEventListener('DOMContentLoaded', function () {
    // Sử dụng Event Delegation để bắt sự kiện cho cả nút tĩnh và nút động (được render bằng JS)
    document.body.addEventListener('click', async function (e) {
        // Tìm nút favorite gần nhất (nếu click vào icon bên trong)
        const btn = e.target.closest('.btn-favorite');

        // Nếu không phải là nút favorite, bỏ qua
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation(); // Ngăn chặn click vào card sản phẩm (nếu có)

        const productId = btn.getAttribute('data-id');
        const icon = btn.querySelector('i');

        if (!productId) return;

        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng đăng nhập',
                text: 'Bạn cần đăng nhập để thêm sản phẩm vào yêu thích.',
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
            const response = await fetch('/api/favorites/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId })
            });

            // Nếu chưa đăng nhập (401) -> chuyển hướng login
            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }

            const data = await response.json();

            if (data.success) {
                // [CẬP NHẬT REALTIME] Cập nhật số lượng yêu thích nếu đang ở trang chi tiết sản phẩm ĐÓ
                const detailContainer = document.getElementById('product-detail-container');
                const countEl = document.getElementById('favorite-count');

                if (detailContainer && countEl && typeof data.totalFavorites !== 'undefined') {
                    const mainProductId = detailContainer.getAttribute('data-product-id');
                    if (String(mainProductId) === String(productId)) {
                        countEl.textContent = data.totalFavorites;
                    }
                }

                if (data.isFavorite) {
                    // Đã thích -> Tím tim
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    btn.setAttribute('title', 'Bỏ thích');
                    showToast('Đã thêm vào danh sách yêu thích');
                } else {
                    // Bỏ thích -> Rỗng tim
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    btn.setAttribute('title', 'Yêu thích');
                    showToast('Đã xóa khỏi danh sách yêu thích');
                }
            } else {
                console.error('Lỗi toggle favorite:', data.message);
                showToast(data.message || 'Có lỗi xảy ra', 'danger');
            }

        } catch (error) {
            console.error('Lỗi kết nối:', error);
            showToast('Lỗi kết nối server', 'danger');
        }
    });
});

// Hàm hiển thị Toast đơn giản (nếu chưa có thư viện Toast)
function showToast(message, type = 'success') {
    // Tạo container nếu chưa có
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '1100';
        document.body.appendChild(toastContainer);
    }

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toastEl);

    // Bootstrap Toggle (đòi hỏi bootstrap.js đã load)
    // Nếu dùng Bootstrap 5:
    if (window.bootstrap && window.bootstrap.Toast) {
        const toast = new window.bootstrap.Toast(toastEl);
        toast.show();
    } else {
        // Fallback đơn giản nếu không có Bootstrap JS
        toastEl.classList.add('show');
        setTimeout(() => toastEl.remove(), 3000);
    }
}
