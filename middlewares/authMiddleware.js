const jwt = require('jsonwebtoken');
const fs = require('fs');
const publicKey = fs.readFileSync('./public.pem', 'utf8');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Từ chối truy cập: Bạn chưa đăng nhập!" });
    }
    try {
        const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: "Từ chối truy cập: Token không hợp lệ!" });
    }
};

const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (req.user && allowedRoles.includes(req.user.role)) {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: "Từ chối truy cập: Bạn không có quyền thực hiện hành động này!"
            });
        }
    };
};

const checkAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') next();
    else return res.status(403).json({ success: false, message: "Chỉ Admin mới được thực hiện!" });
};

module.exports = { verifyToken, checkAdmin, checkRole };