const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const checkToken = require('../../middleware/checkToken');

const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = await User.create({ name, email, password, role });
        const token = generateToken(newUser);

        res.status(201).json({ user: newUser, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.validatePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res.json({ user, token });
        res.json({"message": "User logged in 🪵"});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

