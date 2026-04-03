// Đường dẫn file: middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

// Chìa khóa này BẮT BUỘC phải giống hệt chìa khóa bên file controllers/auth.js lúc nãy
const SECRET_KEY = "ThuVienSo_Hutech_Secret";

// 1. Ông bảo vệ 1: Kiểm tra xem có đem theo Thẻ bài (Token) không?
const verifyToken = (req, res, next) => {
    // Lấy thẻ bài từ trong Header của Postman gửi lên
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Tách chữ "Bearer " ra để lấy đúng cái mã

    if (!token) {
        return res.status(401).json({ success: false, message: "Từ chối truy cập: Bạn chưa đăng nhập (Thiếu Token)!" });
    }

    try {
        // Đưa thẻ bài vào máy quét để giải mã
        const decoded = jwt.verify(token, SECRET_KEY);
        // Quét thành công, lưu thông tin id và role của người này vào request để dùng về sau
        req.user = decoded; 
        next(); // Mở cửa cho đi tiếp vào xử lý (gọi Controller)
    } catch (error) {
        return res.status(403).json({ success: false, message: "Từ chối truy cập: Token không hợp lệ hoặc đã hết hạn!" });
    }
};

// 2. Ông bảo vệ 2: Kiểm tra xem quyền có phải là Admin không?
const checkAdmin = (req, res, next) => {
    // Phải đi qua ông bảo vệ 1 (verifyToken) trước thì mới có biến req.user
    if (req.user && req.user.role === 'Admin') {
        next(); // Đúng là Admin, mời sếp qua!
    } else {
        return res.status(403).json({ success: false, message: "Từ chối truy cập: Chỉ có Admin mới được thực hiện hành động này!" });
    }
};

module.exports = { verifyToken, checkAdmin };