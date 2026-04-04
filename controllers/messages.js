const Message = require('../schemas/messages');

// Lấy toàn bộ lịch sử tin nhắn
const getChatHistory = async (req, res) => {
    try {
        // Lấy tin nhắn và kéo theo tên của người gửi (chỉ lấy fullName và username cho nhẹ)
        // .sort({ createdAt: 1 }) để xếp tin nhắn cũ ở trên, mới ở dưới giống y hệt Zalo/Messenger
        const messages = await Message.find()
                                      .populate('sender', 'fullName username')
                                      .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            message: "Lấy lịch sử chat thành công",
            data: messages
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi Server khi lấy lịch sử chat",
            error: error.message
        });
    }
};

module.exports = {
    getChatHistory
};