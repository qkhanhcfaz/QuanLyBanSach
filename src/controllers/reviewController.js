const db = require('../models');
const { Review } = db;

/**
 * @description     Admin: Xóa một đánh giá.
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

        // Soft delete: chuyển trạng thái thành false
        await review.update({ trang_thai: false });

        res.status(200).json({ message: 'Đánh giá đã được ẩn (xóa mềm) thành công.' });
    } catch (error) {
        console.error("Lỗi khi xóa đánh giá:", error);
        res.status(500).json({ message: 'Lỗi server khi xóa đánh giá.', error: error.message });
    }
};

/**
 * @description     Admin: Cập nhật trạng thái đánh giá (Hiển thị/Ẩn)
 * @route           PATCH /api/reviews/:id/status
 */
const updateReviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { trang_thai } = req.body;

        const review = await Review.findByPk(id);
        if (!review) {
            return res.status(404).json({ message: 'Không tìm thấy đánh giá.' });
        }

        await review.update({ trang_thai: trang_thai === true || trang_thai === 'true' });
        res.json({ message: 'Cập nhật trạng thái thành công.', review });

    } catch (error) {
        console.error('Lỗi cập nhật trạng thái đánh giá:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái.' });
    }
};

module.exports = {
    deleteReview,
    updateReviewStatus
};
