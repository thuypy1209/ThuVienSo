// Đường dẫn file: schemas/reviews.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    // Liên kết với bảng User (Ai là người đánh giá?)
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // Liên kết với bảng Book (Đánh giá cuốn sách nào?)
    book: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book', 
        required: true 
    },
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 // Chấm từ 1 đến 5 sao
    },
    comment: { 
        type: String, 
        required: true 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Review', reviewSchema);