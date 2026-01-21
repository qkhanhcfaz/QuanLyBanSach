// File: /public/js/my-orders.js

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  // Nếu chưa đăng nhập, chuyển hướng
  if (!token) {
    window.location.href = "/login";
    return;
  }

  const ordersContainer = document.getElementById("orders-container");

  // Hàm để fetch và render lịch sử đơn hàng
  async function fetchAndRenderOrders() {
    try {
      const response = await fetch("/api/orders/myorders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        throw new Error("Không thể tải lịch sử đơn hàng.");
      }

      const orders = await response.json();
      renderOrders(orders);
    } catch (error) {
      console.error("Lỗi:", error);
      ordersContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
  }

  // Hàm để render giao diện
  function renderOrders(orders) {
    if (!orders || orders.length === 0) {
      ordersContainer.innerHTML = "<p>Bạn chưa có đơn hàng nào.</p>";
      return;
    }

    let ordersHTML = `
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Mã ĐH</th>
                        <th scope="col">Ngày Đặt</th>
                        <th scope="col">Tổng Tiền</th>
                        <th scope="col">Trạng thái ĐH</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
        `;

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt).toLocaleDateString("vi-VN");
      const totalAmount = parseFloat(order.tong_thanh_toan).toLocaleString(
        "vi-VN",
        { style: "currency", currency: "VND" },
      );
      // Lấy thông tin trạng thái đơn hàng (text và class)
      const statusInfo = getStatusInfo(order.trang_thai_don_hang);
      // <<< LẤY THÔNG TIN TRẠNG THÁI THANH TOÁN >>>
      const paymentStatusInfo = getPaymentStatusInfo(
        order.trang_thai_thanh_toan,
      );

      const statusBadgeHTML = `<span class="badge rounded-pill ${statusInfo.className}">${statusInfo.text}</span>`;
      // <<< TẠO BADGE CHO TRẠNG THÁI THANH TOÁN >>>
      const paymentBadgeHTML = `<span class="badge rounded-pill ${paymentStatusInfo.className}">${paymentStatusInfo.text}</span>`;

      // <<< NÚT HỦY ĐƠN: Chỉ hiện khi Chờ xác nhận hoặc Đã xác nhận >>>
      let actionButtons = `<a href="/orders/${order.id}" class="btn btn-sm btn-info text-white">Xem chi tiết</a>`;
      if (
        order.trang_thai_don_hang === "pending" ||
        order.trang_thai_don_hang === "confirmed"
      ) {
        actionButtons += ` 
              <button onclick="cancelOrder(${order.id})" class="btn btn-sm btn-danger ms-2">Hủy đơn</button>
          `;
      }

      ordersHTML += `
                <tr>
                    <th scope="row">#${order.id}</th>
                    <td>${orderDate}</td>
                    <td>${totalAmount}</td>
                    <td>${statusBadgeHTML}</td> 
                    <td>${actionButtons}</td>
                </tr>
            `;
    });

    ordersHTML += `
            </tbody>
        </table>
    `;
    ordersContainer.innerHTML = ordersHTML;
  }

  // Hàm để lấy class CSS cho từng trạng thái
  function getStatusInfo(status) {
    switch (status) {
      case "pending":
        return { text: "Chờ xác nhận", className: "text-bg-secondary" };
      case "pending_payment":
        return { text: "Chờ thanh toán", className: "text-bg-warning" };
      case "confirmed":
        return { text: "Đã xác nhận", className: "text-bg-primary" };
      case "shipping":
        return { text: "Đang giao", className: "text-bg-info" }; // Bỏ text-dark, text-bg-info tự xử lý
      case "delivered":
        return { text: "Đã giao", className: "text-bg-success" };
      case "cancelled":
        return { text: "Đã hủy", className: "text-bg-danger" };
      default:
        return { text: status, className: "text-bg-light" };
    }
  }
  // <<< THÊM HÀM MỚI ĐỂ XỬ LÝ TRẠNG THÁI THANH TOÁN >>>
  function getPaymentStatusInfo(isPaid) {
    if (isPaid) {
      // isPaid là true
      return { text: "Đã thanh toán", className: "bg-success" };
    } else {
      // isPaid là false
      return { text: "Chưa thanh toán", className: "bg-warning text-dark" };
    }
  }

  // Chạy hàm fetch lần đầu
  // Chạy hàm fetch lần đầu
  fetchAndRenderOrders();
});

// Hàm hủy đơn hàng
window.cancelOrder = async (orderId) => {
  const confirmResult = await Swal.fire({
    title: "Hủy đơn hàng?",
    text: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Đồng ý hủy",
    cancelButtonText: "Không",
  });

  if (confirmResult.isConfirmed) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        await Swal.fire("Đã hủy!", data.message, "success");
        window.location.reload();
      } else {
        Swal.fire("Lỗi!", data.message || "Không thể hủy đơn hàng.", "error");
      }
    } catch (error) {
      console.error("Lỗi khi hủy đơn:", error);
      Swal.fire("Lỗi!", "Đã có lỗi xảy ra.", "error");
    }
  }
};
