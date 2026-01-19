const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Gửi tin nhắn
// POST /api/chat/send
router.post('/send', protect, chatController.sendMessage);

// Lấy tin nhắn (User lấy của mình, Admin lấy của user cụ thể qua query ?userId=...)
// GET /api/chat/messages
router.get('/messages', protect, chatController.getMessages);

// [ADMIN] Lấy danh sách hội thoại
// GET /api/chat/conversations
router.get('/conversations', protect, admin, chatController.getConversations);

module.exports = router;
