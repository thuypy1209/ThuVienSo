// File: routes/messages.js
let express = require("express");
let router = express.Router();
let messageController = require('../controllers/messages');
let { CheckLogin } = require('../utils/authHandler');

// 1. Lấy lịch sử chat (Bắt buộc đăng nhập)
router.get('/', CheckLogin, async function(req, res) {
    try {
        let items = await messageController.GetAll();
        res.status(200).send(items);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 2. Gửi tin nhắn mới (Bắt buộc đăng nhập)
router.post('/', CheckLogin, async function(req, res) {
    try {
        let newItem = await messageController.Create(req.body);
        res.status(201).send(newItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;