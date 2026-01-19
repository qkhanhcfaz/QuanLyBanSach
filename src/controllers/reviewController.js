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

        await review.destroy();

        res.status(200).json({ message: 'Xóa đánh giá thành công.' });
    } catch (error) {
        console.error("Lỗi khi xóa đánh giá:", error);
        res.status(500).json({ message: 'Lỗi server khi xóa đánh giá.', error: error.message });
    }
};

module.exports = {
    deleteReview
};
