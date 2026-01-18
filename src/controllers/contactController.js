const db = require('../models');
const { Contact } = db;

// Tạo liên hệ mới
const createContact = async (req, res) => {
    try {
        const { ho_ten, email, chu_de, noi_dung } = req.body;

        const newContact = await Contact.create({
            ho_ten,
            email,
            chu_de,
            noi_dung
        });

        res.status(201).json({ message: 'Gửi liên hệ thành công!', contact: newContact });
    } catch (error) {
        console.error('Lỗi khi gửi liên hệ:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Lấy danh sách liên hệ (Admin)
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Xóa liên hệ
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByPk(id);
        if (!contact) return res.status(404).json({ message: 'Không tìm thấy liên hệ' });

        await contact.destroy();
        res.json({ message: 'Xóa liên hệ thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = {
    createContact,
    getAllContacts,
    deleteContact
};
