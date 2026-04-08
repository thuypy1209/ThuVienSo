// File: routes/posts.js
let express = require("express");
let router = express.Router();
let postController = require('../controllers/posts');
let { CheckLogin, CheckRole } = require('../utils/authHandler');

// 1. Xem danh sách bài viết (Mở tự do, ai cũng xem được)
router.get('/', async function(req, res) {
    try {
        let items = await postController.GetAllPosts();
        res.status(200).send(items);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 2. Xem chi tiết 1 bài viết (Mở tự do)
router.get('/:id', async function(req, res) {
    try {
        let item = await postController.GetById(req.params.id);
        if (item) res.status(200).send(item);
        else res.status(404).send({ message: "Không tìm thấy bài viết" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 3. Thêm bài viết mới (Bắt buộc là Admin)
router.post('/', CheckLogin, CheckRole('admin'), async function(req, res) {
    try {
        let newItem = await postController.CreatePost(req.body);
        res.status(201).send(newItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// 4. Cập nhật bài viết (Bắt buộc là Admin)
router.put('/:id', CheckLogin, CheckRole('admin'), async function(req, res) {
    try {
        let updatedItem = await postController.UpdatePost(req.params.id, req.body);
        if (!updatedItem) return res.status(404).send({ message: "Không tìm thấy bài viết" });
        res.status(200).send(updatedItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// 5. Xóa bài viết (Bắt buộc là Admin)
router.delete('/:id', CheckLogin, CheckRole('admin'), async function(req, res) {
    try {
        let deletedItem = await postController.Delete(req.params.id);
        if (!deletedItem) return res.status(404).send({ message: "Không tìm thấy bài viết" });
        res.status(200).send(deletedItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;