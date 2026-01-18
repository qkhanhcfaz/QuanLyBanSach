const db = require('../models');
const { Op } = require('sequelize');

/**
 * Gửi tin nhắn mới
 */
const sendMessage = async (req, res) => {
    try {
        const { message, receiver_id } = req.body; // receiver_id chỉ dùng nếu admin gửi
        const sender_type = req.user.role === 'admin' ? 'admin' : 'user';
        
        // Nếu là admin gửi, user_id là người nhận. Nếu là user gửi, user_id là chính họ.
        const user_id = sender_type === 'admin' ? receiver_id : req.user.id;

        if (!message || message.trim() === '') {
            return res.status(400).json({ message: 'Nội dung tin nhắn không được để trống' });
        }

        const newMessage = await db.Message.create({
            user_id: user_id,
            sender_type: sender_type,
            message: message,
            is_read: false
        });

        res.status(201).json(newMessage);

    } catch (error) {
        console.error('Lỗi gửi tin nhắn:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

/**
 * Lấy lịch sử tin nhắn của một cuộc hội thoại
 */
const getMessages = async (req, res) => {
    try {
        // Nếu là admin, có thể xem tin nhắn của bất kỳ user nào (cần truyền userId trên params hoặc query)
        // Nếu là user, chỉ xem được của mình
        let user_id = req.user.id;
        
        if (req.user.role === 'admin' && req.query.userId) {
            user_id = req.query.userId;
        }

        const messages = await db.Message.findAll({
            where: { user_id: user_id },
            order: [['createdAt', 'ASC']]
        });

        // Đánh dấu đã đọc nếu người xem khác người gửi
        // Ví dụ: Admin xem tin nhắn của User -> Đánh dấu tin nhắn của User là đã đọc
        if (req.user.role === 'admin') {
            await db.Message.update({ is_read: true }, {
                where: { user_id: user_id, sender_type: 'user', is_read: false }
            });
        } 
        // Nếu User xem -> Đánh dấu tin nhắn của Admin là đã đọc
        else {
            await db.Message.update({ is_read: true }, {
                where: { user_id: user_id, sender_type: 'admin', is_read: false }
            });
        }

        res.status(200).json(messages);

    } catch (error) {
        console.error('Lỗi lấy tin nhắn:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

/**
 * [ADMIN] Lấy danh sách các cuộc hội thoại
 */
const getConversations = async (req, res) => {
    try {
        // Lấy tất cả user đã từng nhắn tin
        // Cách tối ưu: Group by user_id trong bảng Message
        const conversations = await db.Message.findAll({
            attributes: [
                'user_id',
                [db.sequelize.fn('MAX', db.sequelize.col('createdAt')), 'last_sent'],
                [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN is_read = false AND sender_type = 'user' THEN 1 END")), 'unread_count']
            ],
            group: ['user_id', 'user.id'], // Group theo cả user.id để include user
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['id', 'ho_ten', 'email', 'avatar']
            }],
            order: [[db.sequelize.literal('last_sent'), 'DESC']],
            raw: true,
            nest: true // Để gom dữ liệu user vào object 'user'
        });

        res.status(200).json(conversations);

    } catch (error) {
        console.error('Lỗi lấy danh sách hội thoại:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

/**
 * Render trang chat Admin
 */
const renderAdminChatPage = (req, res) => {
    res.render('admin/pages/chat', {
        title: 'Hỗ trợ khách hàng',
        user: req.user,
        path: '/chat'
    });
};

module.exports = {
    sendMessage,
    getMessages,
    getConversations,
    renderAdminChatPage
};
