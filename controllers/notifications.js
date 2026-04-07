const Notification = require('../schemas/notifications');

const createNotification = async (req, res) => {
    try {
        const { user, message } = req.body;

        const newNotification = await Notification.create({
            user: user,
            message: message
        });

        res.status(201).json({
            success: true,
            message: "Tạo thông báo thành công",
            data: newNotification
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi Server khi tạo thông báo",
            error: error.message
        });
    }
};

const getNotificationsByUser = async (req, res) => {
    try {
        const userId = req.params.userId; 

        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Lấy danh sách thông báo thành công",
            data: notifications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi Server khi lấy thông báo",
            error: error.message
        });
    }
};

module.exports = {
    createNotification,
    getNotificationsByUser
};