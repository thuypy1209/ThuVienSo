// File: routes/reviews.js
let express = require("express");
let router = express.Router();
let reviewController = require('../controllers/reviews');
let { CheckLogin } = require('../utils/authHandler');

// 1. Xem tất cả đánh giá
router.get('/', async function(req, res) {
    try {
        let items = await reviewController.GetAll();
        res.status(200).send(items);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 2. Lấy danh sách đánh giá của 1 cuốn sách (Dành cho Frontend hiển thị chi tiết sách)
router.get('/book/:bookId', async function(req, res) {
    try {
        let items = await reviewController.GetByBook(req.params.bookId);
        res.status(200).send(items);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 3. Xem chi tiết 1 đánh giá
router.get('/:id', async function(req, res) {
    try {
        let item = await reviewController.GetById(req.params.id);
        if (item) res.status(200).send(item);
        else res.status(404).send({ message: "Không tìm thấy đánh giá" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 4. Viết đánh giá (Bắt buộc đăng nhập)
router.post('/', CheckLogin, async function(req, res) {
    try {
        let newItem = await reviewController.Create(req.body);
        res.status(201).send(newItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// 5. Sửa đánh giá (Bắt buộc đăng nhập)
router.put('/:id', CheckLogin, async function(req, res) {
    try {
        let updatedItem = await reviewController.Update(req.params.id, req.body);
        if (!updatedItem) return res.status(404).send({ message: "Không tìm thấy đánh giá" });
        res.status(200).send(updatedItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// 6. Xóa đánh giá (Bắt buộc đăng nhập)
router.delete('/:id', CheckLogin, async function(req, res) {
    try {
        let deletedItem = await reviewController.Delete(req.params.id);
        if (!deletedItem) return res.status(404).send({ message: "Không tìm thấy đánh giá" });
        res.status(200).send(deletedItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;