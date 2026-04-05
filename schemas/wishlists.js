const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    // Cột 1: ID của người dùng
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Bắt tay với bảng User
        required: true
    },
    // Cột 2: ID của cuốn sách
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book', // Bắt tay với bảng Book
        required: true
    }
}, { 
    timestamps: true // Tự động sinh ra cột createdAt (ngày thêm) và updatedAt
});

module.exports = mongoose.model('Wishlist', wishlistSchema);