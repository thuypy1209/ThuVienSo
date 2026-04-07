const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const uploadFile = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Vui lòng chọn một file để tải lên!" });
        }
        
        const fileUrl = `/uploads/${req.file.filename}`;
        
        res.status(200).json({
            success: true,
            message: "Upload file thành công!",
            data: {
                fileUrl: fileUrl,
                fileName: req.file.filename
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    upload,
    uploadFile
};