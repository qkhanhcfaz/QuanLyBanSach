
// Tệp tin: /public/js/product-detail.js
document.addEventListener('DOMContentLoaded', function () {
    const minusBtn = document.getElementById('button-minus');
    const plusBtn = document.getElementById('button-plus');
    const quantityInput = document.getElementById('quantity-input');

    // Xử lý khi nhấn nút trừ
    if (minusBtn) {
        minusBtn.addEventListener('click', function () {
            let currentValue = parseInt(quantityInput.value, 10);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    }

    // Xử lý khi nhấn nút cộng
    if (plusBtn) {
        plusBtn.addEventListener('click', function () {
            let currentValue = parseInt(quantityInput.value, 10);
            const maxQuantity = parseInt(quantityInput.max, 10);
            if (currentValue < maxQuantity) {
                quantityInput.value = currentValue + 1;
            } else {
                // Có thể thêm thông báo cho người dùng ở đây
                alert('Số lượng đã đạt tối đa trong kho.');
            }
        });
    }

    // Ngăn người dùng nhập số âm hoặc lớn hơn max
    if (quantityInput) {
        quantityInput.addEventListener('change', function () {
            let value = parseInt(this.value, 10);
            const min = parseInt(this.min, 10);
            const max = parseInt(this.max, 10);
            if (isNaN(value) || value < min) {
                this.value = min;
            } else if (value > max) {
                this.value = max;
            }
        });
    }
    // === XỬ LÝ FORM ĐÁNH GIÁ ===
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            // Lấy dữ liệu từ form
            const rating = document.querySelector('input[name="rating"]:checked')?.value;
            const comment = document.getElementById('review-comment').value.trim();
            const productId = window.location.pathname.split('/').pop();

            if (!rating && !comment) {
                alert('Vui lòng chọn số sao hoặc viết nhận xét.');
                return;
            }

            const submitButton = reviewForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Đang gửi...';

            try {
                // Chuẩn bị headers (hỗ trợ cả Cookie và Token nếu có)
                const headers = {
                    'Content-Type': 'application/json'
                };
                const token = localStorage.getItem('token');
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch(`/api/products/${productId}/reviews`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ rating, comment })
                });

                const result = await response.json();
                const reviewAlert = document.getElementById('review-alert');

                if (response.ok) {
                    reviewAlert.className = 'alert alert-success';
                    reviewAlert.textContent = 'Cảm ơn bạn đã gửi đánh giá!';
                    reviewForm.reset();
                    // Reload sau 1s để hiển thị đánh giá mới
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    reviewAlert.className = 'alert alert-danger';
                    reviewAlert.textContent = result.message || 'Gửi đánh giá thất bại.';

                    // Nếu lỗi 401, nhắc đăng nhập
                    if (response.status === 401) {
                        Swal.fire('Vui lòng đăng nhập', 'Phiên đăng nhập đã hết hạn.', 'warning');
                    }
                }
                reviewAlert.style.display = 'block';

            } catch (error) {
                console.error('Lỗi khi gửi đánh giá:', error);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Gửi đánh giá';
            }
        });
    }
    // === REALTIME STOCK UPDATE (POLLING) ===
    const stockDisplay = document.getElementById('current-stock');
    const productId = window.location.pathname.split('/').pop();

    if (stockDisplay && productId) {
        setInterval(async () => {
            try {
                const response = await fetch(`/api/products/${productId}/stock`);
                if (response.ok) {
                    const data = await response.json();

                    // Cập nhật giao diện số lượng
                    stockDisplay.textContent = data.stock;

                    // Cập nhật max cho input số lượng
                    if (quantityInput) {
                        quantityInput.max = data.stock;
                        // Nếu số lượng hiện tại > stock mới (do ai đó mua hết), giảm xuống
                        if (parseInt(quantityInput.value) > data.stock) {
                            quantityInput.value = data.stock > 0 ? data.stock : 1;
                        }
                    }

                    // Disable nút mua nếu hết hàng
                    const addToCartBtn = document.querySelector('button[onclick^="addToCart"]');
                    if (addToCartBtn) {
                        if (data.stock <= 0) {
                            addToCartBtn.disabled = true;
                            addToCartBtn.innerHTML = '<i class="fas fa-times-circle me-2"></i>Đã hết hàng';
                        } else {
                            addToCartBtn.disabled = false;
                            addToCartBtn.innerHTML = '<i class="fas fa-cart-plus me-2"></i>Thêm vào giỏ hàng';
                        }
                    }
                }
            } catch (error) {
                console.error('Lỗi cập nhật tồn kho:', error);
            }
        }, 3000); // Cập nhật mỗi 3 giây
    }
});
