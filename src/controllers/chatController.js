const db = require('../models');
const { Op } = require('sequelize');

/**
 * Gửi tin nhắn mới
 */
const sendMessage = async (req, res) => {
    try {
        const { message, receiver_id } = req.body;

        // Check if admin by role_id (1 = admin) or role.ten_quyen
        // Using Number() cast because BIGINT might be returned as a string
        const isAdmin = Number(req.user.role_id) === 1 || req.user.role?.ten_quyen === 'admin';
        const sender_type = isAdmin ? 'admin' : 'user';

        console.log('--- SendMessage Debug ---');
        console.log('User ID:', req.user.id);
        console.log('Role ID (raw):', req.user.role_id, 'Type:', typeof req.user.role_id);
        console.log('Role Name:', req.user.role?.ten_quyen);
        console.log('Computed isAdmin:', isAdmin);
        console.log('Sender Type:', sender_type);
        console.log('-------------------------');

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
        // Check if admin
        // Check if admin using robust check
        const isAdmin = Number(req.user.role_id) === 1 || req.user.role?.ten_quyen === 'admin';

        // Nếu là admin, có thể xem tin nhắn của bất kỳ user nào (cần truyền userId trên params hoặc query)
        // Nếu là user, chỉ xem được của mình
        let user_id = req.user.id;

        if (isAdmin && req.query.userId) {
            user_id = req.query.userId;
        }

        console.log('getMessages - isAdmin:', isAdmin, 'user_id:', user_id, 'query.userId:', req.query.userId);

        const messages = await db.Message.findAll({
            where: { user_id: user_id },
            order: [['createdAt', 'ASC']]
        });

        // Đánh dấu đã đọc nếu người xem khác người gửi
        // Ví dụ: Admin xem tin nhắn của User -> Đánh dấu tin nhắn của User là đã đọc
        if (isAdmin) {
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
        // Method 3: Fetch ALL messages and group in memory (SAFE & SIMPLE)
        const messages = await db.Message.findAll({
            order: [['createdAt', 'DESC']]
        });

        if (!messages || messages.length === 0) {
            return res.status(200).json([]);
        }

        // Group by user_id
        const conversationMap = {};

        messages.forEach(msg => {
            const uid = msg.user_id;
            if (!uid) return; // Skip messages without user_id

            if (!conversationMap[uid]) {
                conversationMap[uid] = {
                    user_id: uid,
                    last_sent: msg.createdAt,
                    unread_count: 0
                };
            }

            if (!msg.is_read && msg.sender_type === 'user') {
                conversationMap[uid].unread_count++;
            }
        });

        const result = Object.values(conversationMap);

        // Fetch User Details (Filter valid IDs only)
        const userIds = result.map(c => c.user_id).filter(id => id);

        let users = [];
        if (userIds.length > 0) {
            users = await db.User.findAll({
                where: {
                    id: userIds,
                    role_id: { [Op.ne]: 1 } // Exclude admin users
                },
                attributes: ['id', 'ho_ten', 'email', 'img', 'role_id']
            });
        }

        const userMap = {};
        users.forEach(u => userMap[u.id] = u);

        // Attach User Data (only for non-admin users)
        const finalResult = result
            .filter(c => userMap[c.user_id]) // Only keep conversations with non-admin users
            .map(c => {
                const userId = c.user_id;
                const user = userMap[userId].toJSON ? userMap[userId].toJSON() : userMap[userId];

                return {
                    ...c,
                    user: user
                };
            });

        // Sort by last_sent DESC
        finalResult.sort((a, b) => new Date(b.last_sent) - new Date(a.last_sent));

        res.status(200).json(finalResult);

    } catch (error) {
        console.error('Lỗi lấy danh sách hội thoại:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
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
