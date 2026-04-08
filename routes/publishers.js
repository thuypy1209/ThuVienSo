let express = require('express');
let router = express.Router();
let publisherController = require('../controllers/publishers');
let { CheckLogin, CheckRole } = require('../utils/authHandler');

// 1. Lấy danh sách NXB
router.get('/', async function(req, res) {
    try {
        let items = await publisherController.GetAll();
        res.status(200).send(items);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});
// 2. Lấy chi tiết 1 NXB
router.get('/:id', async function(req, res) {
    try {
        let item = await publisherController.GetById(req.params.id);
        if (item) res.status(200).send(item);
        else res.status(404).send({ message: "Không tìm thấy Nhà xuất bản" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 3. Thêm NXB (Chỉ admin)
router.post('/', CheckLogin, CheckRole('admin'), async function(req, res) {
    try {
        let newItem = await publisherController.Create(req.body);
        res.status(201).send(newItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// 4. Cập nhật NXB (Chỉ admin)
router.put('/:id', CheckLogin, CheckRole('admin'), async function(req, res) {
    try {
        let updatedItem = await publisherController.Update(req.params.id, req.body);
        if (!updatedItem) return res.status(404).send({ message: "Không tìm thấy Nhà xuất bản" });
        res.status(200).send(updatedItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// 5. Xóa NXB (Chỉ admin)
router.delete('/:id', CheckLogin, CheckRole('admin'), async function(req, res) {
    try {
        let deletedItem = await publisherController.Delete(req.params.id);
        if (!deletedItem) return res.status(404).send({ message: "Không tìm thấy Nhà xuất bản" });
        res.status(200).send(deletedItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;