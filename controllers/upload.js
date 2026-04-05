// Đường dẫn file: controllers/upload.js
let multer = require('multer');
let path = require('path');

// 1. Cấu hình nơi lưu file và tên file
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Nhét file vào thư mục 'uploads'
    },
    filename: function (req, file, cb) {
        // Đổi tên file một chút để lỡ 2 người tải cùng 1 tên file không bị ghi đè lên nhau
        // Tên mới = Thời gian hiện tại + Tên gốc
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// 2. Chạy thư viện multer với cấu hình trên
let upload = multer({ storage: storage });

module.exports = {
// 3. Hàm trả kết quả về cho Postman
    uploadFile: (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: "Vui lòng chọn một file để tải lên!" });
            }
        
        // Tạo đường link để sau này Frontend có thể xem được ảnh
        const fileUrl = `/uploads/${req.file.filename}`;
        
        res.status(200).json({
            success: true,
            message: "Upload file thành công!",
            data: {
                fileUrl: fileUrl,
                fileName: req.file.filename
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
};