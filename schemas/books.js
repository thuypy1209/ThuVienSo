// Đường dẫn file: schemas/books.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    author: { 
        type: String, 
        required: true 
    },
    // ĐÂY LÀ ĐIỂM QUAN TRỌNG: Liên kết với bảng Category
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', // Phải khớp với tên model Category đã tạo
        required: true 
    },
    description: { 
        type: String 
    },
    publishedYear: { 
        type: Number 
    },
    // 2 trường này tạo sẵn để phục vụ yêu cầu Upload File sau này
    coverImage: { 
        type: String, 
        default: '' 
    },
    fileUrl: { 
        type: String, 
        default: '' 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Book', bookSchema);