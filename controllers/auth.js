const UserModel = require('../schemas/users');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bcrypt = require('bcrypt');
const privateKey = fs.readFileSync('./private.pem', 'utf8');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username });

        if (!user) return res.status(404).json({ success: false, message: "Sai tên đăng nhập!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Sai mật khẩu!" });

        const payload = { id: user._id, role: user.role };
        const token = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '1d' });

        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công!",
            data: {
                userInfo: {
                    id: user._id,
                    username: user.username,
                    fullName: user.fullName,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const register = async (req, res) => {
    try {
        const { username, password, fullName, email } = req.body;

        const newUser = new UserModel({
            username,
            password,
            fullName,
            email,
            role: 'Độc giả'
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            success: true,
            message: "Đăng ký thành công! Mời bạn đăng nhập.",
            data: savedUser
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { login, register };