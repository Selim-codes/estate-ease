const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized 🗣️' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) return res.status(401).json({ message: 'User not found 🗺️' });

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token failed 😞' });
    }
};

// 🔐 Authorization middleware
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Access role does not exist 🙅🏻‍♀️' });
        }
        next();
    };
};

exports.checkToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // This enables req.user.id in getMe
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};
