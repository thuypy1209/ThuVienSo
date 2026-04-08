// File: controllers/notifications.js
let NotificationModel = require('../schemas/notifications');

module.exports = {
    // 1. Tạo thông báo mới (Chỉ nhận data)
    Create: async function (data) {
        let newNotification = new NotificationModel(data);
        await newNotification.save();
        return newNotification;
    },

    // 2. Lấy thông báo của 1 user (Xếp mới nhất lên đầu)
    GetByUser: async function (userId) {
        return await NotificationModel.find({ user: userId }).sort({ createdAt: -1 });
    },

    // 3. (Mới) Đánh dấu 1 thông báo là "đã đọc"
    MarkAsRead: async function (id) {
        return await NotificationModel.findByIdAndUpdate(
            id, 
            { isRead: true }, 
            { new: true }
        );
    }
};