// Đường dẫn file: controllers/auth.js
const UserModel = require('../schemas/users');
const jwt = require('jsonwebtoken');

// Chìa khóa bí mật để tạo Thẻ bài (Bạn có thể đổi thành bất cứ chữ gì)
// Thực tế người ta sẽ giấu cái này vào file .env, nhưng đồ án thì để đây cho dễ chạy
const SECRET_KEY = "ThuVienSo_Hutech_Secret"; 

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Tìm xem user có tồn tại trong database không
        const user = await UserModel.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ success: false, message: "Sai tên đăng nhập!" });
        }

        // 2. Kiểm tra mật khẩu 
        // (Lưu ý: Đồ án hiện tại đang lưu pass dạng text thường. Thực tế sẽ dùng bcrypt để băm mật khẩu)
        if (user.password !== password) {
            return res.status(401).json({ success: false, message: "Sai mật khẩu!" });
        }

        // 3. Tạo "Thẻ bài" (JWT Token)
        // Gói thông tin của user vào token (id và role)
        const payload = {
            id: user._id,
            role: user.role
        };

        // Ký tạo token với hạn sử dụng là 1 ngày (1d)
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });

        // 4. Trả về cho Frontend
        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công!",
            data: {
                userInfo: {
                    _id: user._id,
                    id: user._id,
                    username: user.username,
                    fullName: user.fullName,
                    role: user.role
                },
                token: token // Đây chính là cái thẻ bài
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { login };