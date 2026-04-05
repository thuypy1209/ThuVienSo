const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messages');

// [GET] Đường dẫn lấy lịch sử chat
router.get('/', messageController.getChatHistory);

module.exports = router;