const db = require('./src/models');
const { Op } = require('sequelize');

async function debugChat() {
    try {
        console.log('--- Connecting to DB ---');
        await db.sequelize.authenticate();
        console.log('✅ Connected.');

        console.log('--- Testing getConversations Query ---');
        const conversations = await db.Message.findAll({
            attributes: [
                'user_id',
                [db.sequelize.fn('MAX', db.sequelize.col('createdAt')), 'last_sent'],
                [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN is_read = false AND sender_type = 'user' THEN 1 END")), 'unread_count']
            ],
            group: ['user_id', 'user.id'],
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['id', 'ho_ten', 'email']
            }],
            order: [[db.sequelize.literal('last_sent'), 'DESC']],
            raw: true,
            nest: true
        });

        console.log('✅ Query Success. Results:', JSON.stringify(conversations, null, 2));

    } catch (error) {
        console.error('❌ Query Failed:', error);
    } finally {
        await db.sequelize.close();
    }
}

debugChat();
