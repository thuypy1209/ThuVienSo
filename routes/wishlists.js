let express = require("express");
let router = express.Router();
let wishlistController = require('../controllers/wishlists');
let { CheckLogin } = require('../utils/authHandler');

// 1. Lấy danh sách sách yêu thích của 1 người dùng (Truyền ID user lên URL)
router.get('/user/:userId', async function(req, res) {
    try {
        // Truyền req.params.userId vào cho Controller xử lý
        let items = await wishlistController.GetByUser(req.params.userId);
        res.status(200).send(items);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 2. Thêm sách vào mục yêu thích (Bắt buộc phải CheckLogin)
router.post('/', CheckLogin, async function(req, res) {
    try {
        let newItem = await wishlistController.Create(req.body);
        res.status(201).send(newItem);
    } catch (error) {
        // Nếu sách đã có trong Wishlist, lỗi sẽ văng ra ở đây (Báo 400 Bad Request)
        res.status(400).send({ message: error.message });
    }
});

// 3. Xóa sách khỏi mục yêu thích (Dành cho độc giả tự quản lý)
router.delete('/:id', CheckLogin, async function(req, res) {
    try {
        let deletedItem = await wishlistController.Delete(req.params.id);
        if (!deletedItem) return res.status(404).send({ message: "Không tìm thấy dữ liệu để xóa" });
        res.status(200).send(deletedItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;