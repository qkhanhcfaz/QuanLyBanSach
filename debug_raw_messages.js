require('dotenv').config();
const db = require('./src/models');

async function debugRawMessages() {
    try {
        await db.sequelize.authenticate();
        console.log('✅ Connected.');

        const messages = await db.Message.findAll({ raw: true });
        console.log(`Found ${messages.length} messages:`);
        console.log(JSON.stringify(messages, null, 2));

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await db.sequelize.close();
    }
}

debugRawMessages();
