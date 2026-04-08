// File: routes/notifications.js
let express = require("express");
let router = express.Router();
let notificationController = require('../controllers/notifications');
let { CheckLogin, CheckRole } = require('../utils/authHandler');

// 1. Xem danh sách thông báo của mình (Phải đăng nhập)
router.get('/user/:userId', CheckLogin, async function(req, res) {
    try {
        let items = await notificationController.GetByUser(req.params.userId);
        res.status(200).send(items);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 2. Tạo thông báo (Chỉ Admin hệ thống hoặc Thủ thư mới được phép "bắn" thông báo)
router.post('/', CheckLogin, CheckRole('admin'), async function(req, res) {
    try {
        let newItem = await notificationController.Create(req.body);
        res.status(201).send(newItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// 3. Đánh dấu thông báo đã đọc (Phải đăng nhập)
router.put('/:id/read', CheckLogin, async function(req, res) {
    try {
        let updatedItem = await notificationController.MarkAsRead(req.params.id);
        if (!updatedItem) return res.status(404).send({ message: "Không tìm thấy thông báo" });
        res.status(200).send(updatedItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;