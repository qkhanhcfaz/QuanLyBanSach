// Tệp tin: /public/js/checkout.js (Phiên bản nâng cấp)

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Nếu chưa đăng nhập, không cho vào trang này
        window.location.href = '/login?redirect=/checkout'; // Thêm redirect để sau khi đăng nhập quay lại
        return;
    }

    // === LẤY CÁC ELEMENT HTML ===
    const checkoutForm = document.getElementById('checkoutForm');
    const alertBox = document.getElementById('alertBox');

    // Form inputs
    const hoTenInput = document.getElementById('ten_nguoi_nhan');
    const emailInput = document.getElementById('email_nguoi_nhan');
    const sdtInput = document.getElementById('sdt_nguoi_nhan');
    //const diaChiInput = document.getElementById('dia_chi_giao_hang');

    // === CÁC ELEMENT MỚI CHO ĐỊA CHỈ ===
    const provinceSelect = document.getElementById('province');
    const districtSelect = document.getElementById('district');
    const wardSelect = document.getElementById('ward');
    const addressDetailInput = document.getElementById('address-detail');

    // Order summary elements
    const orderSummaryContainer = document.getElementById('order-summary');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');

    // === PHẦN LOGIC XỬ LÝ ĐỊA CHỈ 3 CẤP (TỈNH - HUYỆN - XÃ) ===
    // Sử dụng API mở của Esgoo: https://esgoo.net/
    
    // Hàm gọi API
    async function callApi(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Lỗi kết nối API địa chỉ");
            const result = await response.json();
            if (result.error === 0) {
                return result.data;
            }
            throw new Error(result.error_text || 'Lỗi lấy dữ liệu địa chỉ');
        } catch (error) {
            console.error("API Error:", error);
            return [];
        }
    }

    // Hàm render dữ liệu ra select
    function renderData(data, selectElement) {
        selectElement.innerHTML = `<option value="" selected disabled>Chọn...</option>`;
        if (!data || !Array.isArray(data)) return; 
        for (const item of data) {
            selectElement.innerHTML += `<option value="${item.id}" data-name="${item.full_name}">${item.full_name}</option>`;
        }
    }

    // 1. Lấy danh sách Tỉnh/TP
    callApi('https://esgoo.net/api-tinhthanh/1/0.htm').then(data => renderData(data, provinceSelect));

    // 2. Bắt sự kiện chọn Tỉnh -> lấy Huyện
    provinceSelect.addEventListener('change', () => {
        districtSelect.disabled = false;
        wardSelect.disabled = true;
        wardSelect.innerHTML = '<option value="" selected disabled>Chọn Phường / Xã</option>';
        
        const provinceId = provinceSelect.value;
        callApi(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`).then(data => renderData(data, districtSelect));
    });

    // 3. Bắt sự kiện chọn Huyện -> lấy Xã
    districtSelect.addEventListener('change', () => {
        wardSelect.disabled = false;
        const districtId = districtSelect.value;
        callApi(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`).then(data => renderData(data, wardSelect));
    });

    /**
     * Tự động điền thông tin người dùng nếu đã có trong profile
     */
    async function prefillUserInfo() {
        try {
            const response = await fetch('/api/users/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const user = await response.json();
                hoTenInput.value = user.ho_ten || '';
                emailInput.value = user.email || '';
                sdtInput.value = user.phone || '';
            }
        } catch (error) {
            console.error('Không thể tải thông tin người dùng:', error);
        }
    }

    /**
     * HÀM VALIDATE DỮ LIỆU
     */
    function validateForm(data) {
        let errors = [];

        // 1. Validate Họ tên
        if (!data.ten_nguoi_nhan || data.ten_nguoi_nhan.length > 50) {
            errors.push("Họ và tên bắt buộc và không quá 50 ký tự.");
        }

        // 2. Validate Số điện thoại (10 số, bắt đầu số 0)
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(data.sdt_nguoi_nhan)) {
            errors.push("Số điện thoại phải bao gồm 10 chữ số và bắt đầu bằng số 0.");
        }

        // 3. Validate Email (Có @ và đuôi .com)
        const emailRegex = /^[^\s@]+@[^\s@]+\.com$/i;
        if (!emailRegex.test(data.email_nguoi_nhan)) {
            errors.push("Email không hợp lệ. Vui lòng sử dụng email có đuôi .com");
        }

        // 4. Validate Địa chỉ chi tiết
        if (!data.addressDetailValue || data.addressDetailValue.length > 255) {
            errors.push("Địa chỉ chi tiết bắt buộc và không quá 255 ký tự.");
        }

        // 5. Validate Địa chỉ hành chính
        if (data.provinceText === "Chọn..." || data.districtText === "Chọn..." || data.wardText === "Chọn...") {
            errors.push("Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã.");
        }

        // 6. Validate Ghi chú
        if (data.ghi_chu_khach_hang && data.ghi_chu_khach_hang.length > 500) {
            errors.push("Ghi chú không được vượt quá 500 ký tự.");
        }

        return errors.length > 0 ? errors : null;
    }


    /**
     * Lắng nghe sự kiện submit form thanh toán
     */
    checkoutForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Ẩn thông báo lỗi cũ
        alertBox.style.display = 'none';

        const ten_nguoi_nhan = hoTenInput.value.trim();
        const sdt_nguoi_nhan = sdtInput.value.trim();
        const email_nguoi_nhan = emailInput.value.trim();
        const ghi_chu_khach_hang = document.getElementById('ghi_chu_khach_hang').value.trim();
        const provinceText = provinceSelect.options[provinceSelect.selectedIndex]?.text;
        const districtText = districtSelect.options[districtSelect.selectedIndex]?.text;
        const wardText = wardSelect.options[wardSelect.selectedIndex]?.text;
        const addressDetailValue = addressDetailInput.value.trim();

        // --- VALIDATION DỮ LIỆU ---
        const validationErrors = validateForm({
            ten_nguoi_nhan,
            sdt_nguoi_nhan,
            email_nguoi_nhan,
            ghi_chu_khach_hang,
            provinceText,
            districtText,
            wardText,
            addressDetailValue
        });

        if (validationErrors) {
            alertBox.className = 'alert alert-danger';
            // Hiển thị danh sách lỗi gạch đầu dòng
            alertBox.innerHTML = validationErrors.map(err => `• ${err}`).join('<br>');
            alertBox.style.display = 'block';
            window.scrollTo(0, 0); // Cuộn lên để xem lỗi
            return;
        }

        // Ghép thành một chuỗi duy nhất
        const dia_chi_giao_hang = `${addressDetailValue}, ${wardText}, ${districtText}, ${provinceText}`;
        const phuong_thuc_thanh_toan = document.querySelector('input[name="paymentMethod"]:checked').value;
        const ma_khuyen_mai = sessionStorage.getItem('promoCodeToCheckout') || null;

        // Vô hiệu hóa nút để tránh double-click
        const submitButton = checkoutForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...';

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ten_nguoi_nhan,
                    sdt_nguoi_nhan,
                    dia_chi_giao_hang,
                    email_nguoi_nhan,
                    ghi_chu_khach_hang,
                    phuong_thuc_thanh_toan,
                    ma_khuyen_mai
                })
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.removeItem('promoCodeToCheckout');
                sessionStorage.removeItem('discountAmountApplied');
                if (data.payUrl) {
                    window.location.href = data.payUrl;
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Đặt hàng thành công!',
                        text: 'Cảm ơn bạn đã mua hàng.',
                        allowOutsideClick: false,
                    }).then(() => {
                        window.location.href = `/orders/${data.id}`;
                    });
                }
            } else {
                alertBox.className = 'alert alert-danger';
                alertBox.textContent = data.message || 'Đặt hàng thất bại.';
                alertBox.style.display = 'block';
                submitButton.disabled = false;
                submitButton.textContent = 'Hoàn tất đặt hàng';
                window.scrollTo(0, 0);
            }
        } catch (error) {
            console.error('Lỗi khi đặt hàng:', error);
            alertBox.className = 'alert alert-danger';
            alertBox.textContent = 'Không thể kết nối đến server.';
            alertBox.style.display = 'block';
            submitButton.disabled = false;
            submitButton.textContent = 'Hoàn tất đặt hàng';
        }
    });

    // === KHỞI CHẠY CÁC HÀM ===
    prefillUserInfo();
    fetchAndRenderSummary();
});