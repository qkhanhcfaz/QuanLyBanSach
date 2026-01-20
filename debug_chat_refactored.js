require('dotenv').config();
const db = require('./src/models');

async function debugChatRefactored() {
    try {
        console.log('--- Connecting to DB ---');
        await db.sequelize.authenticate();
        console.log('✅ Connected.');

        console.log('--- Fetching ALL raw messages ---');
        const messages = await db.Message.findAll({
            order: [['createdAt', 'DESC']],
            raw: true
        });
        console.log(`✅ Found ${messages.length} messages.`);

        // JS Grouping Logic
        const conversationMap = {};
        messages.forEach(msg => {
            const uid = msg.user_id;
            if (!conversationMap[uid]) {
                conversationMap[uid] = {
                    user_id: uid,
                    last_sent: msg.createdAt,
                    unread_count: 0
                };
            }
            if (!msg.is_read && (msg.sender_type === 'user' || msg.sender_type === 'User')) {
                conversationMap[uid].unread_count++;
            }
        });

        const result = Object.values(conversationMap);
        console.log(`✅ Grouped into ${result.length} conversations.`);

        if (result.length > 0) {
            console.log('--- Fetching Users ---');
            const userIds = result.map(c => c.user_id);
            const users = await db.User.findAll({
                where: { id: userIds },
                attributes: ['id', 'ho_ten', 'email'],
                raw: true
            });

            const userMap = {};
            users.forEach(u => userMap[u.id] = u);

            const finalResult = result.map(c => ({
                user: userMap[c.user_id]?.ho_ten || 'Unknown',
                last_sent: c.last_sent,
                unread: c.unread_count
            }));

            console.log('Sample Result:', finalResult[0]);
        }

    } catch (error) {
        console.error('❌ Logic Failed:', error);
    } finally {
        await db.sequelize.close();
    }
}

debugChatRefactored();
