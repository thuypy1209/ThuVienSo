const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlists');

// Tạo đường dẫn POST để thêm sách yêu thích
router.post('/', wishlistController.addToWishlist);

// Tạo đường dẫn GET để xem sách yêu thích (Ví dụ: /wishlists/69cfb1...)
router.get('/:userId', wishlistController.getWishlistByUser);

module.exports = router;