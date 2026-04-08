let userModel = require("../schemas/users");
let roleModel = require('../schemas/roles');
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let fs = require('fs')
let crypto = require('crypto')
let nodemailer = require('nodemailer');
let csv = require('csv-parser');
let xlsx = require('xlsx');

let { default: slugify } = require('slugify');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
    }
});

function generateRandomPassword(length = 16) {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) password += chars[crypto.randomInt(0, chars.length)];
    return password;
}

let privateKey = fs.readFileSync('private.pem');


module.exports = {
    CreateAnUser: async function (username, password, email, role, fullName, avatarUrl, status, loginCount) {
        let salt = bcrypt.genSaltSync(10);
        let hashPassword = bcrypt.hashSync(password, salt);
        let newItem = new userModel({
            username: username,
            password: hashPassword,
            email: email,
            fullName: fullName|| username,
            avatarUrl: avatarUrl,
            status: status,
            role: role,
            loginCount: loginCount
        });
        await newItem.save();
        return newItem;
    },
    GetAllUser: async function () {
        return await userModel
            .find({ isDeleted: false })
    },
    GetUserById: async function (id) {
        try {
            return await userModel
                .find({
                    isDeleted: false,
                    _id: id
                })
        } catch (error) {
            return false;
        }
    },
    QueryLogin: async function (username, password) {
        if (!username || !password) {
            return false;
        }
        let user = await userModel.findOne({
            username: username,
            isDeleted: false
        }).populate('role');
        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign(
                { 
                    id: user._id,
                    role: user.role?.name 
                }, // Thêm role vào payload cho bảo mật
                privateKey, 
                { 
                    algorithm: 'RS256', 
                    expiresIn: '1d' 
                }
            );
            return {
                token: token,
                user: {
                    username: user.username,
                    fullName: user.fullName || user.username,
                    role: user.role?.name || 'user',
                }
            };
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    ChangePassword: async function(userId, oldPassword, newPassword) {
    let user = await userModel.findById(userId);
    if (!user) return { success: false, message: "User Not Found" };

    
    let isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) return { success: false, message: "Mat khau cu khong chinh xac" };

  
    // Băm (Hash) mật khẩu mới
    let salt = bcrypt.genSaltSync(10);
    let hashPassword = bcrypt.hashSync(newPassword, salt);
    user.password = hashPassword;
    await user.save();
    return { success: true, message: "Doi mat khau thanh cong" };
    },
    ImportUsers: function (filePath) {
        return new Promise(async (resolve, reject) => {
            try {
                let results = { success: [], failed: [] };
                
                let userRole = await roleModel.findOne({ name: 'user' });
                let roleId = userRole ? userRole._id : '69b6231b3de61addb401ea26'; 

                let workbook = xlsx.readFile(filePath);

                let sheetName = workbook.SheetNames[0]; 

                let sheet = workbook.Sheets[sheetName];

                let users = xlsx.utils.sheet_to_json(sheet);
                for (let user of users) {
                    let username = user.username || user.Username || user.USERNAME;
                    let email = user.email || user.Email || user.EMAIL;

                    if (!username || !email) {
                        results.failed.push({ 
                            reason: "Thiếu cột username hoặc email", 
                            rowData: user 
                        });
                        continue;
                    }

                    let plainPassword = generateRandomPassword(16);

                    try {
                        await module.exports.CreateAnUser(
                            username, plainPassword, email, roleId, 
                            "", "https://i.sstatic.net/l60Hf.png", true, 0
                        );
                        await transporter.sendMail({
                            from: '"Hệ Thống Admin" <${process.env.EMAIL_USER}>', 
                            to: email,
                            subject: 'Tài khoản đăng nhập hệ thống',
                            text: `Chào ${username},\nTài khoản của bạn:\n- Username: ${username}\n- Password: ${plainPassword}\n\nVui lòng đổi mật khẩu sau khi đăng nhập.`
                        });

                        results.success.push({ username, email });
                    } catch (error) {
                        results.failed.push({ username, email, reason: error.message });
                    }
                }
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                resolve(results);

            } catch (error) {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                reject(error);
            }
        });
    }
}