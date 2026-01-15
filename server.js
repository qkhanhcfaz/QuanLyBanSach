// File: server.js

// --- 1. IMPORT CÁC THƯ VIỆN CỐT LÕI ---
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Kích hoạt dotenv ngay lập tức để đọc biến môi trường
dotenv.config();

// Module kết nối cơ sở dữ liệu
const { connectDB, sequelize } = require("./src/config/connectDB");

// [QUAN TRỌNG] Import file models/index.js để thiết lập mối quan hệ giữa các bảng
// Nếu thiếu dòng này, các lệnh include: [{ model: Category }] sẽ bị lỗi
require("./src/models");

// --- 2. IMPORT TẤT CẢ CÁC ROUTER ---
// Routers cho Giao diện (Views)
const viewRouter = require("./src/routes/viewRouter");
const adminRouter = require("./src/routes/adminRouter");

// Routers cho API (Backend Logic)
const authRouter = require("./src/routes/authRouter");
const userRouter = require("./src/routes/userRouter");
const categoryRouter = require("./src/routes/categoryRouter");
const productRouter = require("./src/routes/productRouter");
const reviewRouter = require("./src/routes/reviewRouter");
const cartRouter = require("./src/routes/cartRouter");
const orderRouter = require("./src/routes/orderRouter");
const slideshowRouter = require("./src/routes/slideshowRouter");
const promotionRouter = require("./src/routes/promotionRouter");
const comboRouter = require("./src/routes/comboRouter");
const dashboardRouter = require("./src/routes/dashboardRouter");
const ebookRouter = require("./src/routes/ebookRouter");
const roleRouter = require("./src/routes/roleRouter");
const receiptRouter = require("./src/routes/receiptRouter");
const postRouter = require("./src/routes/postRouter");
const provinceRouter = require("./src/routes/provinceRouter");

// --- 3. KHỞI TẠO APP ---
const app = express();

// Kết nối CSDL
connectDB();

// --- 4. CẤU HÌNH MIDDLEWARE ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware xử lý dữ liệu đầu vào
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// Middleware phục vụ file tĩnh (CSS, JS, Ảnh)
app.use(express.static(path.join(__dirname, "public")));

// --- 5. GẮN (MOUNT) ROUTER ---

// A. API Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/slideshows", slideshowRouter);
app.use("/api/promotions", promotionRouter);
app.use("/api/combos", comboRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/ebooks", ebookRouter);
app.use("/api/roles", roleRouter);
app.use("/api/receipts", receiptRouter);
app.use("/api/posts", postRouter);
app.use("/api/provinces", provinceRouter);

// B. Admin Routes
app.use("/admin", adminRouter);

// C. View Routes (Trang chủ, sản phẩm...) - Đặt cuối cùng
app.use("/", viewRouter);

// --- 6. KHỞI CHẠY SERVER ---
const PORT = process.env.PORT || 8080;

// Sử dụng { alter: true } để tự động cập nhật cấu trúc bảng nếu có thay đổi
// (Ví dụ: thêm cột mới vào bảng products, tạo bảng receipts mới...)
// TẠM THỜI TẮT alter: true ĐỂ TRÁNH LỖI SYNTAX POSTGRES
sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
      console.log(`🔧 Trang Admin: http://localhost:${PORT}/admin/products`);
    });
  })
  .catch((err) => {
    console.error("❌ Lỗi đồng bộ Database:", err);
  });
