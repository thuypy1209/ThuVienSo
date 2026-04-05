const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    // Cột 1: Gửi cho ai?
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Cột 2: Nội dung thông báo
    message: {
        type: String,
        required: true
    },
    // Cột 3: Trạng thái đã đọc hay chưa (Mặc định là false - chưa đọc)
    isRead: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Notification', notificationSchema);