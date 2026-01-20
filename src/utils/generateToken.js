const jwt = require('jsonwebtoken');

const generateToken = (id, role_id) => {
    return jwt.sign({ id, role_id }, process.env.JWT_SECRET || 'secret_key_123', {
        expiresIn: '30d',
    });
};

module.exports = generateToken;
