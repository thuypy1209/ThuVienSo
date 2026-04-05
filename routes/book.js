var express = require('express');
var router = express.Router();
let bookController = require('../controllers/books');
let { CheckLogin, CheckRole } = require('../utils/authHandler'); 

// API Public: Ai cũng có thể xem danh sách và chi tiết sách
router.get('/', bookController.GetAllBooks){
    
};
router.get('/:id', bookController.GetBookById);

// API Private: Chỉ Admin mới có quyền Thêm, Sửa, Xóa
// (Nếu role Admin của bạn tên khác, ví dụ 'Admin' hay 'Quản trị', hãy sửa lại chuỗi 'admin' bên dưới cho khớp nhé)
router.post('/', CheckLogin, CheckRole('admin'), bookController.CreateBook);
router.put('/:id', CheckLogin, CheckRole('admin'), bookController.UpdateBook);
router.delete('/:id', CheckLogin, CheckRole('admin'), bookController.DeleteBook);

module.exports = router;