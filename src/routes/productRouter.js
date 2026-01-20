// File: /src/routes/productRouter.js

const express = require('express');
const router = express.Router();

// Import models
const { Product, Category, sequelize } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middlewares/authMiddleware');
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    exportProductsToExcel,
    getBestsellerProducts,
    createReview,
    getAllPublishers,
    getProductStock,
} = require('../controllers/productController');

// Cấu hình Multer để upload ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
        // Sử dụng tên gốc hoặc thêm timestamp để tránh trùng lặp
        // Đảm bảo giữ nguyên đuôi file (extension)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Chỉ chấp nhận file ảnh
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Chỉ chấp nhận file ảnh!';
        return cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});







// === ĐỊNH NGHĨA CÁC ROUTES ===

// GET /api/products/publishers
router.get('/publishers', getAllPublishers);

// GET /api/products/export/excel
router.get('/export/excel', exportProductsToExcel);

// GET /api/products/bestsellers
router.get('/bestsellers', getBestsellerProducts);


// GET /api/products - Lấy danh sách sản phẩm từ database (hỗ trợ query params)
router.get('/', getAllProducts);

// API Lấy số lượng tồn kho (Realtime)
router.get('/:id/stock', getProductStock);

// GET /api/products/:id - Lấy chi tiết sản phẩm
// (Ưu tiên route này nằm SAU route :id/stock để tránh trùng lặp nếu có logic conflict, nhưng stock cụ thể hơn nên để trước là an toàn nhất)
router.get('/:id', getProductById);

// POST /api/products/:id/reviews - Gửi đánh giá
router.post('/:id/reviews', protect, createReview);


// POST /api/products - Tạo sản phẩm mới (có upload ảnh)
router.post('/', upload.single('img'), createProduct);

// PUT /api/products/:id - Cập nhật sản phẩm (có upload ảnh)
router.put('/:id', upload.single('img'), updateProduct);

// DELETE /api/products/:id
router.delete('/:id', deleteProduct);

module.exports = router;
