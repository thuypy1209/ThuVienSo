// Đường dẫn file: routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// Mở đường dẫn POST /auth/login
router.post('/login', authController.login);

module.exports = router;