// File: /src/routes/productRouter.js

const express = require('express');
const router = express.Router();

// Import models
const { Product, Category, sequelize } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middlewares/authMiddleware');

// --- MULTER CONFIG FOR IMAGE UPLOAD ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
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
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getBestsellerProducts,
    createReview,
    updateProductStatus,
    getAllPublishers,
    getProductStock
} = require('../controllers/productController');

// --- PUBLIC ROUTES ---
router.get('/bestsellers', getBestsellerProducts);
router.get('/publishers', getAllPublishers);
router.get('/:id/stock', getProductStock);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/:id/reviews', protect, createReview);

// --- ADMIN ROUTES ---
router.post('/', protect, admin, upload.single('img'), createProduct);
router.put('/:id', protect, admin, upload.single('img'), updateProduct);
router.patch('/:id/status', protect, admin, updateProductStatus);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
