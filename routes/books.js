let express = require("express");
let router = express.Router();
let bookController = require('../controllers/books');
let { CheckLogin, CheckRole } = require('../utils/authHandler');

// 1. Lấy danh sách Sách (Ai cũng xem được)
router.get('/', async function(req, res) {
    try {
        let items = await bookController.GetAllBook();
        res.status(200).send(items);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 2. Lấy chi tiết 1 cuốn Sách (Ai cũng xem được)
router.get('/:id', async function(req, res) {
    try {
        let item = await bookController.GetById(req.params.id);
        if (item) res.status(200).send(item);
        else res.status(404).send({ message: "Không tìm thấy sách" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 3. Thêm Sách (Chỉ Admin)
router.post('/', CheckLogin, CheckRole('admin'), async function(req, res) {
    try {
        let newItem = await bookController.CreateBook(req.body);
        res.status(201).send(newItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// 4. Cập nhật Sách (Chỉ Admin)
router.put('/:id', CheckLogin, CheckRole('admin'), async function(req, res) {
    try {
        let updatedItem = await bookController.UpdateBook(req.params.id, req.body);
        if (!updatedItem) return res.status(404).send({ message: "Không tìm thấy sách" });
        res.status(200).send(updatedItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// 5. Xóa Sách (Chỉ Admin)
router.delete('/:id', CheckLogin, CheckRole('admin'), async function(req, res) {
    try {
        let deletedItem = await bookController.DeleteBook(req.params.id);
        if (!deletedItem) return res.status(404).send({ message: "Không tìm thấy sách" });
        res.status(200).send(deletedItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;