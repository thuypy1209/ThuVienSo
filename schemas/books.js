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
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        required: true 
    },
    description: { 
        type: String 
    },
    publishedYear: { 
        type: Number 
    },
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