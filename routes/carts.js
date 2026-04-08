// File: routes/carts.js
let express = require("express");
let router = express.Router();
let cartController = require('../controllers/carts');
let { CheckLogin } = require('../utils/authHandler');

// 1. Lấy giỏ hàng của 1 user (Phải đăng nhập)
router.get('/user/:userId', CheckLogin, async function(req, res) {
    try {
        let items = await cartController.GetByUser(req.params.userId);
        res.status(200).send(items);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 2. Thêm sách vào giỏ hàng (Phải đăng nhập)
router.post('/', CheckLogin, async function(req, res) {
    try {
        let newItem = await cartController.CreateCart(req.body);
        res.status(201).send(newItem);
    } catch (error) {
        // Lỗi "Sách đã có trong giỏ" sẽ được bắt và trả về ở đây (400 Bad Request)
        res.status(400).send({ message: error.message });
    }
});

// 3. Xóa sách khỏi giỏ hàng (Phải đăng nhập)
router.delete('/:id', CheckLogin, async function(req, res) {
    try {
        let deletedItem = await cartController.DeleteCart(req.params.id);
        if (!deletedItem) return res.status(404).send({ message: "Không tìm thấy sách trong giỏ" });
        res.status(200).send(deletedItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;