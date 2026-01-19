// File: /public/js/main.js (Phiên bản cuối cùng cho bố cục 2 cột)

/**
 * Sự kiện này sẽ được kích hoạt khi toàn bộ cấu trúc HTML của trang đã được tải xong.
 * Đây là điểm khởi đầu cho tất cả các mã JavaScript phía client.
 */
document.addEventListener('DOMContentLoaded', () => {

    // ====================================================================
    // PHẦN 1: CÁC HÀM LUÔN CHẠY TRÊN MỌI TRANG
    // ====================================================================
    handleAuthLinks();
    handlePopupLogin(); // <--- Kích hoạt logic popup login
    loadCategoriesForMenu();

    // ====================================================================
    // PHẦN 2: CÁC HÀM CHỈ CHẠY RIÊNG CHO TRANG CHỦ
    // ====================================================================
    if (document.getElementById('hero-swiper')) {
        initializeAllSwipers();
        loadHomePageData();
    }
});


/**
 * ===================================================================
 * ĐỊNH NGHĨA CÁC HÀM CHI TIẾT
 * ===================================================================
 */

/**
 * Xử lý việc hiển thị link Đăng nhập/Đăng ký hoặc "Xin chào [tên]" với menu dropdown.
 */
function handleAuthLinks() {
    const authLinksContainer = document.getElementById('auth-links');
    if (!authLinksContainer) return;

    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (token && userString) {
        const user = JSON.parse(userString);
        authLinksContainer.innerHTML = `
            <div class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    Xin chào, ${user.ho_ten}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="/profile">Thông tin tài khoản</a></li>
                    <li><a class="dropdown-item" href="/favorites">Sách yêu thích</a></li>
                    <li><a class="dropdown-item" href="/my-orders">Lịch sử đơn hàng</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" id="logout-btn">Đăng xuất</a></li>
                </ul>
            </div>
        `;
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (event) => {
                event.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            });
        }
    } else {
        authLinksContainer.innerHTML = `
            <button class="btn btn-outline-primary me-2" data-bs-toggle="modal" data-bs-target="#loginModal">
                Đăng nhập
            </button>
            <a class="btn btn-primary" href="/register">Đăng ký</a>
        `;
    }
}

/**
 * Xử lý logic đăng nhập trên Popup Modal
 */
function handlePopupLogin() {
    const popupForm = document.getElementById('popupLoginForm');
    if (!popupForm) return;

    popupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = popupForm.email.value;
        const mat_khau = popupForm.mat_khau.value;
        const alertBox = document.getElementById('popup-alert');
        const submitBtn = popupForm.querySelector('button[type="submit"]');

        // Reset trạng thái
        alertBox.style.display = 'none';
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Đang xử lý...';

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, mat_khau }),
            });

            const data = await response.json();

            if (response.ok) {
                // Lưu token
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    id: data.id,
                    ho_ten: data.ho_ten,
                    email: data.email,
                    role_id: data.role_id
                }));

                // Ẩn modal
                const modalEl = document.getElementById('loginModal');
                const modal = bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();

                // SweetAlert báo thành công
                await Swal.fire({
                    icon: 'success',
                    title: 'Đăng nhập thành công!',
                    text: `Chào mừng ${data.ho_ten} quay trở lại!`,
                    timer: 1500,
                    showConfirmButton: false
                });

                // Reload trang để cập nhật Header
                window.location.reload();
            } else {
                alertBox.className = 'alert alert-danger';
                alertBox.textContent = data.message || 'Đăng nhập thất bại';
                alertBox.style.display = 'block';
            }
        } catch (error) {
            console.error('Login Error:', error);
            alertBox.className = 'alert alert-danger';
            alertBox.textContent = 'Mất kết nối server. Vui lòng thử lại sau.';
            alertBox.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Đăng Nhập';
        }
    });
}

/**
 * Lấy dữ liệu danh mục từ API và render ra menu dropdown ở header.
 */
async function loadCategoriesForMenu() {
    const menuList = document.getElementById('category-menu-list');
    if (!menuList) return;

    try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const categories = await response.json();

        menuList.innerHTML = '';
        categories.forEach(cat => {
            menuList.innerHTML += `<li><a class="dropdown-item" href="/products?category=${cat.id}">${cat.ten_danh_muc}</a></li>`;
        });
    } catch (error) {
        console.error("Error loading categories:", error);
        menuList.innerHTML = '<li><a class="dropdown-item text-danger" href="#">Lỗi tải danh mục</a></li>';
    }
}

/**
 * Khởi tạo tất cả các thư viện Swiper.js cho slideshow và các carousel sản phẩm.
 */
function initializeAllSwipers() {
    new Swiper('#hero-swiper', {
        loop: true,
        autoplay: { delay: 4000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    const productSwiperOptions = {
        slidesPerView: 2,
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: { slidesPerView: 3, spaceBetween: 20 },
            992: { slidesPerView: 4, spaceBetween: 20 },
            1200: { slidesPerView: 5, spaceBetween: 20 },
        }
    };

    new Swiper('#bestseller-swiper', productSwiperOptions);
    new Swiper('#vh-vietnam-swiper', productSwiperOptions);
    new Swiper('#vh-nuoc-ngoai-swiper', productSwiperOptions);
    new Swiper('#finance-swiper', productSwiperOptions);
}

/**
 * Hàm điều phối việc tải tất cả dữ liệu cần thiết cho trang chủ.
 */
function loadHomePageData() {
    // Tải slideshow chính
    fetchSlideshow();

    // Tải dữ liệu cho cột trái
    fetchNewArrivals();
    fetchPostsAndRender();

    // Tải dữ liệu cho cột phải
    fetchProductsAndRender('#bestseller-products-wrapper', '/bestsellers?limit=10');
    fetchProductsAndRender('#vh-vietnam-products-wrapper', '?category=31&limit=10');
    fetchProductsAndRender('#vh-nuoc-ngoai-products-wrapper', '?category=5&limit=10');
    fetchProductsAndRender('#finance-products-wrapper', '?category=1&limit=10');

}

/**
 * Lấy dữ liệu slideshow từ API và render ra giao diện.
 */
async function fetchSlideshow() {
    const wrapper = document.getElementById('hero-swiper-wrapper');
    if (!wrapper) return;

    try {
        const response = await fetch('/api/slideshows/public');
        if (!response.ok) throw new Error('Failed to fetch slideshows');
        const slides = await response.json();

        if (slides && slides.length > 0) {
            wrapper.innerHTML = slides.map(slide => `
                <div class="swiper-slide">
                     <a href="${slide.link_to || '#'}">
                        <img src="${slide.image_url}" class="img-fluid" alt="${slide.tieu_de || 'Banner'}">
                    </a>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error("Error loading slideshow:", error);
    }
}

/**
 * Hàm chung để lấy sản phẩm từ API và render ra các carousel ở cột phải.
 */
async function fetchProductsAndRender(wrapperId, pathAndQuery) {
    const wrapper = document.querySelector(wrapperId);
    if (!wrapper) return;

    try {
        const apiUrl = `/api/products${pathAndQuery}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`API call failed for ${apiUrl} with status ${response.status}`);

        const result = await response.json();
        let products;

        if (Array.isArray(result)) {
            products = result;
        } else if (result && result.products) {
            products = result.products;
        } else {
            products = [];
        }

        if (products && products.length > 0) {
            const productsHTML = products.map(product => `
                <div class="swiper-slide">
                    <div class="card product-card h-100">

                        <a href="/products/${product.id}">
                            <div class="product-image position-relative">
                                <img src="${product.img}" alt="${product.ten_sach}">

                            </div>
                        </a>

                        <div class="card-body d-flex flex-column text-center">
                            <h6 class="card-title">
                                ${product.ten_sach}
                            </h6>

                            <p class="card-text text-danger fw-bold">
                                ${parseFloat(product.gia_bia).toLocaleString('vi-VN')}₫
                            </p>

                            <div class="d-flex gap-2">
                                <button 
                                    onclick="addToCart('${product.id}')" 
                                    class="btn btn-sm btn-outline-primary mt-auto flex-grow-1">
                                    Thêm vào giỏ
                                </button>
                                ${(() => {
                    const isFav = window.favoriteProductIds && window.favoriteProductIds.includes(product.id);
                    return `<button class="btn btn-favorite-card btn-favorite border" 
                                            data-id="${product.id}" 
                                            title="${isFav ? 'Bỏ thích' : 'Yêu thích'}">
                                        <i class="${isFav ? 'fas text-danger' : 'far text-danger'} fa-heart"></i>
                                    </button>`;
                })()}
                            </div>
                        </div>

                    </div>
                </div>
            `).join('');

            wrapper.innerHTML = productsHTML;
        } else {
            wrapper.innerHTML = '<div class="text-muted p-3">Không có sản phẩm nào thuộc mục này.</div>';
        }
    } catch (error) {
        console.error(`Lỗi khi tải sản phẩm cho ${wrapperId}:`, error);
        wrapper.innerHTML = '<p class="text-danger p-3">Lỗi tải sản phẩm.</p>';
    }
}

/**
 * Lấy dữ liệu sách mới nhất và render ra cột trái.
 */
async function fetchNewArrivals() {
    const wrapper = document.getElementById('new-arrivals-wrapper');
    if (!wrapper) return;

    try {
        const response = await fetch(`/api/products?sortBy=createdAt&order=DESC&limit=5`);
        if (!response.ok) throw new Error('Failed to fetch new arrivals');

        const result = await response.json();
        const products = result.products;

        if (products && products.length > 0) {
            wrapper.innerHTML = products.map(product => `
                <div class="card mb-3 border-0">
                    <div class="row g-0">
                        <div class="col-4">
                            <a href="/products/${product.id}" class="position-relative d-block">
                                <img src="${product.img || '/images/placeholder.png'}" class="img-fluid rounded-start" alt="${product.ten_sach}">

                            </a>
                        </div>
                        <div class="col-8">
                            <div class="card-body p-2">
                                <h6 class="card-title mb-1" style="font-size: 0.9rem;">
                                    <a href="/products/${product.id}" class="text-decoration-none text-dark">${product.ten_sach}</a>
                                </h6>
                                <p class="card-text text-danger fw-bold mb-2">${parseFloat(product.gia_bia).toLocaleString('vi-VN')}₫</p>
                                ${(() => {
                    const isFav = window.favoriteProductIds && window.favoriteProductIds.includes(product.id);
                    return `<button class="btn btn-favorite-card btn-favorite border float-end" 
                                            data-id="${product.id}" 
                                            title="${isFav ? 'Bỏ thích' : 'Yêu thích'}">
                                        <i class="${isFav ? 'fas text-danger' : 'far text-danger'} fa-heart"></i>
                                    </button>`;
                })()}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            wrapper.innerHTML = '<p class="text-muted">Không có sản phẩm mới.</p>';
        }
    } catch (error) {
        console.error("Error loading new arrivals:", error);
        wrapper.innerHTML = '<p class="text-danger">Lỗi tải sản phẩm mới.</p>';
    }
}

/**
 * Lấy dữ liệu các bài viết mới nhất và render ra cột trái.
 */
async function fetchPostsAndRender() {
    const wrapper = document.getElementById('posts-wrapper');
    if (!wrapper) return;

    try {
        const response = await fetch(`/api/posts/public?limit=3`);
        if (!response.ok) throw new Error('Failed to fetch posts');

        const posts = await response.json();

        if (posts && posts.length > 0) {
            wrapper.innerHTML = posts.map(post => `
                <div class="card mb-3 shadow-sm">
                    <a href="/blog/${post.slug}">
                        <img src="${post.anh_dai_dien || '/images/placeholder.png'}" class="card-img-top" alt="${post.tieu_de}">
                    </a>
                    <div class="card-body p-2">
                        <h6 class="card-title mb-1" style="font-size: 0.95rem;">
                            <a href="/blog/${post.slug}" class="text-decoration-none text-dark">${post.tieu_de}</a>
                        </h6>
                    </div>
                </div>
            `).join('');
        } else {
            wrapper.innerHTML = '<p class="text-muted">Chưa có bài viết nào.</p>';
        }
    } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
        wrapper.innerHTML = '<p class="text-danger">Lỗi tải bài viết.</p>';
    }
}