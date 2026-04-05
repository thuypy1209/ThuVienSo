const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    // Ai là người gửi tin nhắn này?
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Nội dung tin nhắn là gì?
    content: {
        type: String,
        required: true
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Message', messageSchema);