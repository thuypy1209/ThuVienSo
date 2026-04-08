let jwt = require('jsonwebtoken');
let fs = require('fs');
let publicKey = fs.readFileSync('public.pem');

// Gọi schema user trực tiếp vào đây để dùng lệnh populate
let userModel = require('../schemas/users'); 

module.exports = {
    CheckLogin: async function (req, res, next) {
        try {
            let token = req.headers.authorization;
            if (!token || !token.startsWith("Bearer")) {
                return res.status(403).send({ message: "Bạn chưa đăng nhập" });
            }
            
            token = token.split(' ')[1];
            let result = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
            
            if (result.exp * 1000 < Date.now()) {
                return res.status(403).send({ message: "Token đã hết hạn, vui lòng đăng nhập lại" });
            }

            // ĐIỂM MẤU CHỐT Ở ĐÂY: Dùng populate('role') để lấy thông tin chi tiết của quyền
            let getUser = await userModel.findOne({ _id: result.id, isDeleted: false }).populate('role');
            
            if (!getUser) {
                return res.status(403).send({ message: "Tài khoản không tồn tại hoặc đã bị khóa" });
            } 
            
            // Gán user đã được populate vào req
            req.user = getUser;
            next();
            
        } catch (error) {
            res.status(403).send({ message: "Token không hợp lệ hoặc lỗi xác thực" });
        }
    },

    CheckRole: function (roleName) {
        return function (req, res, next) {
            // Nhờ populate ở trên, req.user.role giờ đã là 1 object { _id: "...", name: "admin", ... }
            if (req.user && req.user.role && req.user.role.name === roleName) {
                next(); // Đi tiếp nếu đúng quyền
            } else {
                res.status(403).send({ message: "Bạn không có quyền truy cập chức năng này" });
            }
        };
    }
}