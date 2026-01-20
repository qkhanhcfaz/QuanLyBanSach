document.addEventListener('DOMContentLoaded', function () {
  // ====================================================================
  // ======================= KHAI BÁO BIẾN & DOM =======================
  // ====================================================================
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Vui lòng đăng nhập lại để tiếp tục.');
    window.location.href = '/login';
    return;
  }

  const tableBody = document.getElementById('categoriesTableBody');
  const categoryModalEl = document.getElementById('categoryModal');
  const categoryModalInstance = new bootstrap.Modal(categoryModalEl);
  const categoryForm = document.getElementById('categoryForm');
  const parentSelect = document.getElementById('danh_muc_cha_id');

  let allCategories = []; // Biến để lưu trữ toàn bộ danh sách, tránh gọi API nhiều lần

  // ====================================================================
  // ====================== CÁC HÀM RENDER (VIEW) =======================
  // ====================================================================

  /**
   * Hàm chính để render bảng, nó sẽ tự xây dựng cấu trúc cây từ danh sách phẳng
   * @param {Array} categories - Mảng tất cả danh mục từ API
   */
  function renderCategoryTable(categories) {
    tableBody.innerHTML = '';
    if (!categories || categories.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Chưa có danh mục nào.</td></tr>';
      return;
    }

    // Helper recursive function to render category tree
    const renderTree = (cats, level) => {
      // Sort by name
      cats.sort((a, b) => a.ten_danh_muc.localeCompare(b.ten_danh_muc));

      cats.forEach(cat => {
        tableBody.insertAdjacentHTML('beforeend', createCategoryRowHTML(cat, level));

        // Find children: Loose equality (==) to handle string/number mismatch
        const children = categories.filter(c => c.danh_muc_cha_id == cat.id);

        if (children.length > 0) {
          renderTree(children, level + 1);
        }
      });
    };

    // Start with root categories (no parent)
    const rootCategories = categories.filter(cat => !cat.danh_muc_cha_id);
    renderTree(rootCategories, 0);
  }

  /**
   * Hàm tiện ích tạo chuỗi HTML cho một hàng <tr>
   */
  function createCategoryRowHTML(category, level) {
    const indent = level > 0 ? '&nbsp;'.repeat(level * 4) + '└─ ' : '';
    // Find parent name
    const parent = allCategories.find(c => c.id == category.danh_muc_cha_id);
    const parentName = parent ? parent.ten_danh_muc : '(Không có)';
    const productCount = category.productCount || (category.dataValues ? category.dataValues.productCount : 0);

    return `
            <tr data-id="${category.id}">
                <td>${category.id}</td>
                <td>${indent}${category.ten_danh_muc}</td>
                <td>${parentName}</td>
                <td class="text-center">${productCount}</td>
                <td>
                    <button class="btn btn-warning btn-sm btn-edit" title="Sửa"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm btn-delete" title="Xóa"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
  }

  /**
   * Cập nhật danh sách <option> cho thẻ <select> danh mục cha
   */
  function updateParentCategorySelect(currentCategoryId = null) {
    parentSelect.innerHTML = '<option value="">-- Là danh mục gốc --</option>';

    // Build tree for select options
    const roots = [];
    const categoryMap = new Map();

    // Initialize map
    allCategories.forEach(cat => {
      cat.children = [];
      categoryMap.set(cat.id, cat); // ID should be number from API usually, but map uses strict key
    });

    allCategories.forEach(cat => {
      if (cat.id == currentCategoryId) return; // Skip self

      if (cat.danh_muc_cha_id) {
        // Convert to same type as key (assuming cat.id is number, ensure danh_muc_cha_id is number)
        // But safer to just find via loop if we are unsure, OR cast to number.
        // Let's cast to whatever the map key is.
        // Assuming cat.id is likely a number if from JSON usually.
        // But let's safely use find if we want to be 100% sure or cast.
        // Casting to Number is safe for "1" -> 1.
        const parentId = Number(cat.danh_muc_cha_id);
        const parent = categoryMap.get(parentId);
        if (parent) {
          parent.children.push(cat);
        } else {
          // If parent not found (maybe filtered out?), treat as root for select? 
          // Or just ignore.
        }
      } else {
        roots.push(cat);
      }
    });

    const renderOptions = (cats, level) => {
      cats.forEach(category => {
        const indent = '- '.repeat(level);
        parentSelect.innerHTML += `<option value="${category.id}">${indent}${category.ten_danh_muc}</option>`;
        if (category.children.length > 0) {
          renderOptions(category.children, level + 1);
        }
      });
    };

    renderOptions(roots, 0);
  }

  // ====================================================================
  // ======================= CÁC HÀM XỬ LÝ SỰ KIỆN ======================
  // ====================================================================

  // Xử lý tìm kiếm
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const keyword = document.getElementById('search-keyword').value.trim().toLowerCase();

      if (!keyword) {
        // Nếu không có từ khóa, render lại dạng cây ban đầu
        renderCategoryTable(allCategories);
        return;
      }

      // Tìm kiếm (Flat filter)
      const matches = allCategories.filter(cat =>
        cat.ten_danh_muc.toLowerCase().includes(keyword)
      );

      renderCategoryTableFlat(matches);
    });

    // Optional: Live search
    document.getElementById('search-keyword').addEventListener('input', (e) => {
      const keyword = e.target.value.trim().toLowerCase();
      if (!keyword) renderCategoryTable(allCategories);
    });
  }

  /**
   * Render danh sách danh mục dạng phẳng (cho kết quả tìm kiếm)
   */
  function renderCategoryTableFlat(categories) {
    tableBody.innerHTML = '';
    if (!categories || categories.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Không tìm thấy danh mục nào phù hợp.</td></tr>';
      return;
    }

    // Sắp xếp theo tên A-Z
    categories.sort((a, b) => a.ten_danh_muc.localeCompare(b.ten_danh_muc));

    categories.forEach(cat => {
      // Render level 0 (không thụt đầu dòng)
      tableBody.insertAdjacentHTML('beforeend', createCategoryRowHTML(cat, 0));
    });
  }

  async function loadCategories() {
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></td></tr>`;
    try {
      const response = await fetch('/api/categories', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error('Không thể tải danh sách danh mục.');
      allCategories = await response.json();
      renderCategoryTable(allCategories);
    } catch (error) {
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">${error.message}</td></tr>`;
    }
  }

  function prepareCreateForm() {
    categoryForm.reset();
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryModalLabel').textContent = 'Thêm Danh mục mới';
    updateParentCategorySelect();
    categoryModalInstance.show();
  }

  async function prepareEditForm(id) {
    try {
      const category = allCategories.find(c => c.id == id);
      if (!category) throw new Error('Không tìm thấy danh mục.');

      document.getElementById('categoryId').value = category.id;
      document.getElementById('ten_danh_muc').value = category.ten_danh_muc;
      document.getElementById('mo_ta').value = category.mo_ta || '';
      document.getElementById('img').value = category.img || '';
      parentSelect.value = category.danh_muc_cha_id || '';
      document.getElementById('categoryModalLabel').textContent = 'Chỉnh sửa Danh mục';

      updateParentCategorySelect(id); // Cập nhật lại select, loại bỏ chính nó
      parentSelect.value = category.danh_muc_cha_id || ''; // Đặt lại giá trị sau khi cập nhật

      categoryModalInstance.show();
    } catch (error) {
      Swal.fire('Lỗi!', error.message, 'error');
    }
  }

  async function handleFormSubmit() {
    const id = document.getElementById('categoryId').value;
    const data = {
      ten_danh_muc: document.getElementById('ten_danh_muc').value,
      danh_muc_cha_id: document.getElementById('danh_muc_cha_id').value || null,
      mo_ta: document.getElementById('mo_ta').value,
      img: document.getElementById('img').value
    };

    if (!data.ten_danh_muc) {
      Swal.fire('Thiếu thông tin', 'Tên danh mục là bắt buộc!', 'warning');
      return;
    }

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/categories/${id}` : '/api/categories';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Thao tác thất bại.');

      categoryModalInstance.hide();
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: result.message || (id ? 'Cập nhật thành công!' : 'Thêm mới thành công!'),
        timer: 1500,
        showConfirmButton: false
      });
      loadCategories();
    } catch (error) {
      Swal.fire('Lỗi!', error.message, 'error');
    }
  }

  async function deleteCategory(id) {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: `Bạn sẽ không thể hoàn tác hành động này!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Vâng, xóa nó đi!',
      cancelButtonText: 'Hủy bỏ'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);

        Swal.fire('Đã xóa!', result.message, 'success');
        loadCategories();
      } catch (error) {
        Swal.fire('Xóa thất bại!', error.message, 'error');
      }
    }
  }

  // ====================================================================
  // ======================= GẮN EVENT LISTENERS =======================
  // ====================================================================

  document.querySelector('[data-bs-target="#categoryModal"]').addEventListener('click', prepareCreateForm);
  categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit();
  });

  tableBody.addEventListener('click', (e) => {
    const editButton = e.target.closest('.btn-edit');
    if (editButton) {
      const id = editButton.closest('tr').dataset.id;
      prepareEditForm(id);
      return;
    }

    const deleteButton = e.target.closest('.btn-delete');
    if (deleteButton) {
      const id = deleteButton.closest('tr').dataset.id;
      deleteCategory(id);
      return;
    }
  });

  // ====================================================================
  // ============================ KHỞI CHẠY =============================
  // ====================================================================
  loadCategories();
});
