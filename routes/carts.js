const express = require('express');
const router = express.Router();
const cartController = require('../controllers/carts');

// [POST] Thêm vào giỏ
router.post('/', cartController.addToCart);

// [GET] Xem giỏ sách của 1 người dùng
router.get('/:userId', cartController.getCartByUser);

// [DELETE] Xóa 1 cuốn sách khỏi giỏ (Phương thức DELETE)
router.delete('/:id', cartController.removeFromCart);

module.exports = router;