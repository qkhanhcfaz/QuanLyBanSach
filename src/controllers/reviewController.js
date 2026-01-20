const db = require('../models');
const { Review } = db;

/**
 * @description     Admin: Xóa (ẩn) một đánh giá.
 * @route           DELETE /api/reviews/:id
 * @access          Private/Admin
 */
const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Không tìm thấy đánh giá.' });
        }

        // Soft delete: Chuyển trạng thái về 0 thay vì xóa vĩnh viễn
        await review.update({ trang_thai: 0 });

        res.status(200).json({ message: 'Ẩn đánh giá thành công.' });
    } catch (error) {
        console.error("Lỗi khi ẩn đánh giá:", error);
        res.status(500).json({ message: 'Lỗi server khi ẩn đánh giá.', error: error.message });
    }
};

/**
 * @description     Admin: Cập nhật trạng thái review
 * @route           PUT /api/reviews/:id/status
 * @access          Private/Admin
 */
const updateReviewStatus = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const { trang_thai } = req.body;

        // Validate trang_thai value
        if (trang_thai !== 0 && trang_thai !== 1) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ. Chỉ chấp nhận 0 hoặc 1.' });
        }

        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Không tìm thấy đánh giá.' });
        }

        await review.update({ trang_thai });

        res.status(200).json({
            message: `Đã cập nhật trạng thái thành ${trang_thai === 1 ? 'Hiển thị' : 'Ẩn'}`,
            trang_thai
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái review:", error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái.', error: error.message });
    }
};

module.exports = {
    deleteReview,
    updateReviewStatus
};
