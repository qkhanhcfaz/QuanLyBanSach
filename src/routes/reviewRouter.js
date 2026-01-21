const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middlewares/authMiddleware');
const { deleteReview, updateReviewStatus } = require('../controllers/reviewController');

// Route test (có thể giữ hoặc xóa)
router.get('/', (req, res) => {
    res.json({ message: 'Review routes' });
});

// Admin: Cập nhật trạng thái đánh giá
router.patch('/:id/status', protect, admin, updateReviewStatus);

// Admin: Xóa đánh giá (Xóa mềm)
router.delete('/:id', protect, admin, deleteReview);

module.exports = router;
