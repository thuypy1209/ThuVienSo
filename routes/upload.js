const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload');

router.post('/', uploadController.upload.single('file'), uploadController.uploadFile);

module.exports = router;