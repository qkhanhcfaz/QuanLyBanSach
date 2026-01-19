// File: server.js

// --- 1. IMPORT CÁC THƯ VIỆN CỐT LÕI ---
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Kích hoạt dotenv ngay lập tức để đọc biến môi trường
dotenv.config();

const { checkUser } = require("./src/middlewares/authMiddleware");

// Module kết nối cơ sở dữ liệu
const { connectDB, sequelize } = require("./src/config/connectDB");

// [QUAN TRỌNG] Import file models/index.js để thiết lập mối quan hệ giữa các bảng
// Nếu thiếu dòng này, các lệnh include: [{ model: Category }] sẽ bị lỗi
const db = require("./src/models");
const { SiteSetting } = db;

// --- 2. IMPORT TẤT CẢ CÁC ROUTER ---
// Routers cho Giao diện (Views)
const viewRouter = require("./src/routes/viewRouter");
const adminRouter = require("./src/routes/adminRouter");

// Routers cho API (Backend Logic)
const authRouter = require('./src/routes/authRouter');
const userRouter = require('./src/routes/userRouter');
const categoryRouter = require('./src/routes/categoryRouter');
const productRouter = require('./src/routes/productRouter');
const reviewRouter = require('./src/routes/reviewRouter');
const cartRouter = require('./src/routes/cartRouter');
const orderRouter = require('./src/routes/orderRouter');
const slideshowRouter = require('./src/routes/slideshowRouter');
const promotionRouter = require('./src/routes/promotionRouter');
const comboRouter = require('./src/routes/comboRouter');
const dashboardRouter = require('./src/routes/dashboardRouter');
const ebookRouter = require('./src/routes/ebookRouter');
const roleRouter = require('./src/routes/roleRouter');
const receiptRouter = require('./src/routes/receiptRouter');
const postRouter = require('./src/routes/postRouter');
const provinceRouter = require('./src/routes/provinceRouter');
const favoriteRouter = require('./src/routes/favoriteRouter');
const chatRouter = require('./src/routes/chatRouter');
const contactRouter = require('./src/routes/contactRouter');
// const postRouter = require('./src/routes/postRouter'); -> Already declared above

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
// Middleware checkUser để lấy thông tin user từ token (nếu có) cho mọi request
app.use(checkUser);

// Middleware phục vụ file tĩnh (CSS, JS, Ảnh)
app.use(express.static(path.join(__dirname, "public")));

// Middleware: gắn thông tin website dùng chung cho EJS
app.use(async (req, res, next) => {
  try {
    let site = await SiteSetting.findOne();

    // Nếu chưa có dòng cấu hình nào thì tạo 1 dòng mặc định
    if (!site) {
      site = await SiteSetting.create({
        ten_website: "BookZone",
        dia_chi: "Quận 7, TP. Hồ Chí Minh",
        email: "bookzonestore07@gmail.com",
        so_dien_thoai: "0969 671 344",

        // ✅ ĐÚNG TÊN CỘT DB
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",

        nam_ban_quyen: 2026,
      });
    }

    // res.locals là biến “dùng chung” trong EJS (mọi trang đều truy cập được)
    res.locals.site = site;
    next();
  } catch (err) {
    console.error("Lỗi load SiteSetting:", err);
    // Nếu lỗi DB thì vẫn cho chạy trang (footer sẽ fallback)
    res.locals.site = null;
    next();
  }
});

// --- 5. GẮN (MOUNT) ROUTER ---

// A. API Routes
<<<<<<< HEAD
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
app.use("/api/favorites", favoriteRouter);
=======
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/slideshows', slideshowRouter);
app.use('/api/promotions', promotionRouter);
app.use('/api/combos', comboRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/ebooks', ebookRouter);
app.use('/api/roles', roleRouter);
app.use('/api/receipts', receiptRouter);
app.use('/api/posts', postRouter);
app.use('/api/provinces', provinceRouter);
app.use('/api/favorites', favoriteRouter);
app.use('/api/chat', chatRouter);
app.use('/api/contacts', contactRouter);
app.use('/api/posts', postRouter);
>>>>>>> 77da11814b85677759fc226a8054ba992b7611f8

// B. Admin Routes
app.use("/admin", adminRouter);

// C. View Routes (Trang chủ, sản phẩm...) - Đặt cuối cùng
app.use("/", viewRouter);

// --- 6. KHỞI CHẠY SERVER ---
const PORT = process.env.PORT || 8080;

<<<<<<< HEAD
// Tạm thời tắt alter: true để tránh lỗi syntax khi sync với bảng Users (Postgres)
// Chúng ta sẽ dùng script riêng để update DB nếu cần.
sequelize
  .sync()
  .then(() => {
=======
// 👉 IMPORT SEED (chỉ dùng khi cần)
// const seedProducts = require('./src/seeders/seedProducts');
// const seedOrders = require('./src/seeders/seedOrders');

sequelize.sync({ alter: true })
  .then(async () => {
    // ⚠️ CHỈ CHẠY SEED 1 LẦN, SAU ĐÓ COMMENT DÒNG NÀY
    // await seedProducts();
    // await seedOrders();

>>>>>>> 77da11814b85677759fc226a8054ba992b7611f8
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
      console.log(`🔧 Trang Admin: http://localhost:${PORT}/admin/products`);
    });
  })
  .catch((err) => {
    console.error("❌ Lỗi đồng bộ Database:", err);
  });
