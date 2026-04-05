// Đường dẫn file: schemas/users.js
const mongoose = require('mongoose');

// Định nghĩa cấu trúc dữ liệu cho bảng User
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, // Bắt buộc phải có
        unique: true    // Không được trùng lặp với người khác
    },
    password: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    fullName: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['Admin', 'Thủ thư', 'Độc giả'], // Chỉ được chọn 1 trong 3 quyền này
        default: 'Độc giả' // Nếu không truyền lên thì mặc định là Độc giả
    },
    isActive: { 
        type: Boolean, 
        default: true // Trạng thái tài khoản (đang hoạt động hay bị khóa)
    }
}, { 
    timestamps: true // Tự động tạo 2 cột: createdAt (ngày tạo) và updatedAt (ngày cập nhật)
});

// Xuất model ra để các file khác có thể gọi vào sử dụng
module.exports = mongoose.model('User', userSchema);