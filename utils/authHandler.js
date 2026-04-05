let userController = require('../controllers/users')
let jwt = require('jsonwebtoken')
let fs = require('fs');
let publicKey = fs.readFileSync('public.pem');
module.exports = {
    CheckLogin: async function (req, res, next) {
        try {
            let token = req.headers.authorization;
            if (!token || !token.startsWith("Bearer")) {
                res.status(403).send({ message: "ban chua dang nhap" })
                return;
            }
            token = token.split(' ')[1]
            let result = jwt.verify(
                token, 
                publicKey, { 
                    algorithms: ['RS256'] 
                });
            if (result.exp * 1000 < Date.now()) {
                res.status(403).send({ message: "ban chua dang nhap" })
                return;
            }
            let getUser = await userController.GetUserById(result.id);
            if (!getUser) {
                res.status(403).send({ message: "ban chua dang nhap" })
            } else {
                req.user = getUser;
                next();
            }
        } catch (error) {
            res.status(403).send({ message: "ban chua dang nhap" })
        }

    },
    CheckRole: function (roleName) {
        return function (req, res, next) {
            // req.user được gán từ CheckLogin, cần populate trường role để lấy name
            if (req.user && req.user.role && req.user.role.name === roleName) {
                next();
            } else {
                res.status(403).send({ message: "Bạn không có quyền truy cập chức năng này" });
            }
        };
    }
}