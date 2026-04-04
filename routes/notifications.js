const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notifications');

// Tạo đường dẫn POST để thêm thông báo
router.post('/', notificationController.createNotification);

// Tạo đường dẫn GET để lấy thông báo
router.get('/:userId', notificationController.getNotificationsByUser);

module.exports = router;