// File: routes/ebookFiles.js
let express = require("express");
let router = express.Router();
let ebookController = require('../controllers/ebookFiles');
let { CheckLogin, CheckRole } = require('../utils/authHandler');

// 1. Xem danh sách Ebook (Chỉ cần đăng nhập)
router.get('/', CheckLogin, async function(req, res) {
    try {
        let items = await ebookController.GetAll();
        res.status(200).send(items);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 2. Xem chi tiết/Tải 1 Ebook (Chỉ cần đăng nhập)
router.get('/:id', CheckLogin, async function(req, res) {
    try {
        let item = await ebookController.GetById(req.params.id);
        if (item) res.status(200).send(item);
        else res.status(404).send({ message: "Không tìm thấy file sách" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 3. Thêm Ebook (Bắt buộc phải là Admin)
router.post('/', CheckLogin, CheckRole('admin'), async function(req, res) {
    try {
        let newItem = await ebookController.Create(req.body);
        res.status(201).send(newItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// 4. Cập nhật Ebook (Bắt buộc phải là Admin)
router.put('/:id', CheckLogin, CheckRole('admin'), async function(req, res) {
    try {
        let updatedItem = await ebookController.Update(req.params.id, req.body);
        if (!updatedItem) return res.status(404).send({ message: "Không tìm thấy file sách" });
        res.status(200).send(updatedItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// 5. Xóa Ebook (Bắt buộc phải là Admin)
router.delete('/:id', CheckLogin, CheckRole('admin'), async function(req, res) {
    try {
        let deletedItem = await ebookController.Delete(req.params.id);
        if (!deletedItem) return res.status(404).send({ message: "Không tìm thấy file sách" });
        res.status(200).send(deletedItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;