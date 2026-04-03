// Đường dẫn file: routes/categories.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categories'); 

// Gọi 2 ông bảo vệ vào
const { verifyToken, checkAdmin } = require('../middlewares/authMiddleware');

// Route này KHÔNG GẮN bảo vệ -> Ai cũng xem được
router.get('/', categoryController.getAllCategories);

// 3 Route này GẮN bảo vệ -> Phải đi qua verifyToken rồi mới qua checkAdmin
router.post('/', verifyToken, checkAdmin, categoryController.createCategory);
router.put('/:id', verifyToken, checkAdmin, categoryController.updateCategory);
router.delete('/:id', verifyToken, checkAdmin, categoryController.deleteCategory);

module.exports = router;