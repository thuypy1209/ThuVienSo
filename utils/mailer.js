let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Thêm EMAIL_USER vào file .env
        pass: process.env.EMAIL_PASS  // Thêm EMAIL_PASS (App Password) vào file .env
    }
});

module.exports = {
    sendPasswordEmail: async function(email, username, password) {
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thông tin đăng nhập hệ thống',
            text: `Chào ${username},\n\nTài khoản của bạn đã được tạo thành công.\n- Tên đăng nhập: ${username}\n- Mật khẩu: ${password}\n\nVui lòng đăng nhập và đổi mật khẩu trong lần đầu sử dụng.\n\nTrân trọng!`
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error(`Lỗi gửi email cho ${email}:`, error.message);
        }
    }
};