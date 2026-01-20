const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middlewares/authMiddleware');
const {
    getPublicPosts,
    getPostDetail,
    createPost,
    updatePost,
    deletePost,
    getAllPostsAdmin
} = require('../controllers/postController');

// Helper: Cấu hình Multer upload ảnh
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
        return cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Public Routes
router.get('/', getPublicPosts);
router.get('/:id', getPostDetail);

// Admin Routes (CRUD)
router.get('/admin/all', protect, admin, getAllPostsAdmin);
router.post('/', protect, admin, upload.single('hinh_anh'), createPost);
router.put('/:id', protect, admin, upload.single('hinh_anh'), updatePost);
router.delete('/:id', protect, admin, deletePost);

module.exports = router;
