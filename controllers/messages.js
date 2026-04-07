const Message = require('../schemas/messages');

const getChatHistory = async (req, res) => {
    try {
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