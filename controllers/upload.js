// File: controllers/upload.js
let multer = require('multer');
let path = require('path');

// 1. Cấu hình Multer (Giữ nguyên logic rất chuẩn của bạn)
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Thư mục lưu file
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

let uploadMiddleware = multer({ 
    storage: storage,
    // GIỚI HẠN DUNG LƯỢNG: Chỉ cho phép file tối đa 50MB (50 * 1024 * 1024 bytes)
    limits: { fileSize: 50 * 1024 * 1024 }, 
    
    // LỌC FILE: Chỉ cho phép up Ảnh và PDF (Chặn các file virus .exe, .bat...)
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
            cb(null, true); // Hợp lệ thì cho qua
        } else {
            cb(new Error('Hệ thống chỉ cho phép tải lên file Ảnh hoặc file PDF!'), false); // Chặn lại
        }
    }
});

module.exports = {
    // Xuất cái middleware ra để xài ở Router
    uploadMiddleware: uploadMiddleware,

    // 2. Hàm xử lý logic 3 lớp (Chỉ nhận file object, không dùng req res)
    UploadFile: async function (file) {
        if (!file) {
            throw new Error("Vui lòng chọn một file để tải lên!");
        }
        
        return {
            fileUrl: `/uploads/${file.filename}`,
            fileName: file.filename
        };
    }
};