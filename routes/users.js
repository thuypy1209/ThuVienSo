// Đường dẫn file: routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/users'); 

// Mở đường dẫn GET /users -> Lấy danh sách
router.get('/', userController.getAllUsers);

// Mở đường dẫn POST /users -> Tạo mới
router.post('/', userController.createUser);

// Mở đường dẫn PUT /users/:id -> Cập nhật (Sửa)
// Dấu :id nghĩa là một giá trị động (chính là _id của user)
router.put('/:id', userController.updateUser);

// Mở đường dẫn DELETE /users/:id -> Xóa
router.delete('/:id', userController.deleteUser);

module.exports = router;