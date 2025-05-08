const express = require('express');
const { register, login, getMe } = require('../controllers/auth');
const {checkToken} = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', checkToken, getMe);

module.exports = router;