const Notification = require('../schemas/notifications');

// 1. Chức năng: Tạo thông báo mới
const createNotification = async (req, res) => {
    try {
        const { user, message } = req.body;

        const newNotification = await Notification.create({
            user: user,
            message: message
            // Không cần ghi isRead vì nó tự động là false rồi
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

// 2. Chức năng: Lấy danh sách thông báo của 1 người dùng cụ thể
const getNotificationsByUser = async (req, res) => {
    try {
        const userId = req.params.userId; 

        // Lấy thông báo của user này, sắp xếp theo thời gian mới nhất lên đầu (createdAt: -1)
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