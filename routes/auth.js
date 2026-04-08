var express = require("express");
var router = express.Router();
let userController = require('../controllers/users')
let { RegisterValidator, validatedResult } = require('../utils/validator')
let {CheckLogin} = require('../utils/authHandler')
let {ChangePasswordValidator} = require('../utils/validator')
//login
router.post('/login',async function (req, res, next) {
    try{
        let { username, password } = req.body;
        let result = await userController.QueryLogin(username,password);
        if(!result){
            return res.status(404).send("thong tin dang nhap khong dung")
        }
        return res.status(200).json({
                token: result.token,
                user: result.user
        });
    }catch(err){
        return res.status(500).send({ message: err.message });
    }
})
router.post('/register', RegisterValidator, validatedResult, async function (req, res, next) {
    let { username, password, email } = req.body;
    let newUser = await userController.CreateAnUser(
        username, password, email, '69b6231b3de61addb401ea26'
    )
    res.status(201).json(newUser);
})
router.get('/me',CheckLogin,function(req,res,next){
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi lấy thông tin cá nhân" });
    }
})

//register
//changepassword
router.post('/change-password', CheckLogin, ChangePasswordValidator, validatedResult, async function (req, res) {
    try {
        let result = await userController.ChangePassword(
            req.user._id, 
            req.body.oldPassword, 
            req.body.newPassword
        );
        if (result.success) {
            return res.send(result);
        } else {
            return res.status(400).send(result);
        }
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
});


//me
//forgotpassword
//permission
module.exports = router;