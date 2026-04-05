// Đường dẫn file: routes/upload.js
const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload');

// Hàm upload.single('file') báo cho server biết: "Hứng cái file từ cái ô có tên là 'file' nhé!"
router.post('/', uploadController.upload.single('file'), uploadController.uploadFile);

module.exports = router;