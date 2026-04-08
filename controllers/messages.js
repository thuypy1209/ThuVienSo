// File: controllers/messages.js
let MessageModel = require('../schemas/messages');

module.exports = {
    // 1. Lấy toàn bộ lịch sử tin nhắn (Xếp từ cũ đến mới chuẩn Zalo)
    GetAll: async function () {
        return await MessageModel.find()
            .populate('sender', 'fullName username')
            .sort({ createdAt: 1 });
    },

    // 2. Gửi tin nhắn mới (Tặng thêm cho bạn)
    Create: async function (data) {
        // data sẽ chứa { sender, content } hoặc các trường tương ứng trong schema của bạn
        let newMessage = new MessageModel(data);
        await newMessage.save();
        return newMessage;
    }
};