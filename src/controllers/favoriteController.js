const { Favorite } = require('../models');

/**
 * @description     Toggle Favorite (Like / Unlike)
 * @route           POST /api/favorites/toggle
 * @access          Private
 */
const toggleFavorite = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy từ middleware verifyToken (gán vào req.user)
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: 'Thiếu Product ID' });
        }

        // Tìm xem đã thích chưa
        const existingFavorite = await Favorite.findOne({
            where: {
                user_id: userId,
                product_id: productId
            }
        });

        if (existingFavorite) {
            // Đã thích -> Xóa (Unlike)
            await existingFavorite.destroy();
            const totalFavorites = await Favorite.count({ where: { product_id: productId } });
            return res.json({ success: true, isFavorite: false, totalFavorites, message: 'Đã xóa khỏi danh sách yêu thích' });
        } else {
            // Chưa thích -> Tạo mới (Like)
            await Favorite.create({
                user_id: userId,
                product_id: productId
            });
            const totalFavorites = await Favorite.count({ where: { product_id: productId } });
            return res.json({ success: true, isFavorite: true, totalFavorites, message: 'Đã thêm vào danh sách yêu thích' });
        }

    } catch (error) {
        console.error('Lỗi toggle favorite:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

/**
 * @description     Get list of favorite product IDs for current user
 *                  (Dùng để check trạng thái khi render)
 */
const getMyFavoriteIds = async (userId) => {
    try {
        if (!Favorite) {
            console.error('CRITICAL ERROR: Favorite model is UNDEFINED in favoriteController');
            return [];
        }
        console.log(`DEBUG_CTRL: Fetching favorites for user ${userId} (Type: ${typeof userId})`);
        const favorites = await Favorite.findAll({
            where: { user_id: userId },
            attributes: ['product_id']
        });
        const result = favorites.map(f => f.product_id);
        console.log(`DEBUG_CTRL: Found ${result.length} favorites: ${result.join(',')}`);
        return result;
    } catch (error) {
        console.error('Lỗi lấy danh sách yêu thích (DETAIL):', error);
        return [];
    }
};

module.exports = {
    toggleFavorite,
    getMyFavoriteIds
};
