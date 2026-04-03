// Đường dẫn file: schemas/categories.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true // Không được tạo 2 danh mục trùng tên nhau
    },
    description: { 
        type: String 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Category', categorySchema);