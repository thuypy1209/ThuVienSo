// File: routes/upload.js
let express = require("express");
let router = express.Router();
let uploadController = require('../controllers/upload');
let { CheckLogin } = require('../utils/authHandler');

// API Upload file (Bắt buộc đăng nhập, ai cũng có thể upload avatar hoặc file)
// Chữ 'file' trong hàm .single('file') chính là tên KEY bạn sẽ điền trên Postman
router.post('/', CheckLogin, uploadController.uploadMiddleware.single('file'), async function(req, res) {
    try {
        // Truyền req.file (do multer vừa xử lý) vào cho Controller
        let result = await uploadController.UploadFile(req.file);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;