const jwt = require('jsonwebtoken');

const generateToken = (id, email, name, isAdmin) => {
    return jwt.sign(
        { id, email, name, isAdmin },
        process.env.JWT_SECRET || 'anykey',
        {
            expiresIn: '30d',
        }
    );
};

const verifyToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_SECRET || 'anykey',
        (err, decoded) => {
            if (err) {
                return false;
            } else {
                return decoded;
            }
        }
    );
};

const getTokenFromHeaders = (req) => {
    const headerAuth = req.headers;
    const token = headerAuth['authorization'].split(' ')[1];
    if (token !== undefined) {
        return token;
    } else {
        return {
            status: 'Failed',
            msg: 'Invalid token',
        };
    }
};

module.exports = { generateToken, verifyToken, getTokenFromHeaders };
