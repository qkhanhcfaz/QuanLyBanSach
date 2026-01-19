const db = require('../models');
const { Role } = db;

/**
 * Lấy danh sách tất cả các vai trò
 */
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll({
            attributes: ['id', 'ten_quyen']
        });
        res.status(200).json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = {
    getAllRoles
};
