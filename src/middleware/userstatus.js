const { User } = require('../models');

const checkActive = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is deactivated' });
        }

        next();
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = checkActive;