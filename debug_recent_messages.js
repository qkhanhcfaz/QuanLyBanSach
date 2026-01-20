const db = require('./src/models');

async function checkRecentMessages() {
    try {
        const messages = await db.Message.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']]
        });

        console.log('Recent Messages (JSON):');
        console.log(JSON.stringify(messages, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkRecentMessages();
