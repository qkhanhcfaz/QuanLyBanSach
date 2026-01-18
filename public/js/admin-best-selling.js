document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        window.location.href = '/login';
        return;
    }

    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const filterBtn = document.getElementById('filter-btn');
    const tableBody = document.getElementById('best-selling-body');

    // Helper: Định dạng tiền tệ
    const formatCurrency = (amount) => {
        if (typeof amount !== 'number' && typeof amount !== 'string') return '0 ₫';
        const numberAmount = parseFloat(amount);
        if (isNaN(numberAmount)) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numberAmount);
    };

    const showLoading = () => {
        if (filterBtn) {
            filterBtn.disabled = true;
            filterBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Đang tải...';
        }
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="4" class="text-center">Đang tải dữ liệu...</td></tr>';
        }
    };

    const hideLoading = () => {
        if (filterBtn) {
            filterBtn.disabled = false;
            filterBtn.innerHTML = '<i class="fas fa-filter mr-2"></i>Lọc';
        }
    };

    const renderTable = (products) => {
        if (!tableBody) return;
        tableBody.innerHTML = '';

        if (!products || products.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" class="text-center">Không có dữ liệu trong khoảng thời gian này.</td></tr>';
            return;
        }

        products.forEach((item, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.product ? item.product.ten_sach : 'Sản phẩm đã xóa'}</td>
                    <td class="font-weight-bold text-center">${item.total_sold}</td>
                    <td class="text-right text-success font-weight-bold">${formatCurrency(item.total_revenue)}</td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    };

    const fetchBestSellingData = async (startDate, endDate) => {
        showLoading();
        const params = new URLSearchParams({ startDate, endDate });
        const apiUrl = `/api/dashboard/best-selling?${params.toString()}`;

        try {
            const response = await fetch(apiUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lỗi tải dữ liệu');
            }

            const data = await response.json();
            renderTable(data);
        } catch (error) {
            console.error('Error fetching best selling data:', error);
            if (tableBody) {
                tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Lỗi: ${error.message}</td></tr>`;
            }
        } finally {
            hideLoading();
        }
    };

    // Event Listeners
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            const start = startDateInput.value;
            const end = endDateInput.value;

            if (!start || !end) {
                alert('Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc.');
                return;
            }
            if (new Date(start) > new Date(end)) {
                alert('Ngày bắt đầu không được lớn hơn ngày kết thúc.');
                return;
            }

            fetchBestSellingData(start, end);
        });
    }

    // Default dates: 30 days ago to today
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    if (endDateInput) endDateInput.value = today.toISOString().split('T')[0];
    if (startDateInput) startDateInput.value = thirtyDaysAgo.toISOString().split('T')[0];

    // Initial load
    if (startDateInput && endDateInput) {
        fetchBestSellingData(startDateInput.value, endDateInput.value);
    }
});
