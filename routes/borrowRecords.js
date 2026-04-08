// File: routes/borrowRecords.js
let express = require("express");
let router = express.Router();
let borrowController = require('../controllers/borrowRecords');
let { CheckLogin, CheckRole } = require('../utils/authHandler');

// 1. Lấy danh sách phiếu mượn (Chỉ Admin/Thủ thư mới được xem toàn bộ)
router.get('/', CheckLogin, CheckRole('admin'), async function(req, res) {
    try {
        let items = await borrowController.GetAll();
        res.status(200).send(items);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 2. Lấy chi tiết 1 phiếu mượn
router.get('/:id', CheckLogin, async function(req, res) {
    try {
        let item = await borrowController.GetById(req.params.id);
        if (item) res.status(200).send(item);
        else res.status(404).send({ message: "Không tìm thấy phiếu mượn" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 3. Tạo phiếu mượn
router.post('/', CheckLogin, CheckRole('admin'), async function(req, res) {
    try {
        let newItem = await borrowController.Create(req.body);
        res.status(201).send(newItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// 4. Cập nhật phiếu mượn (Thường dùng để update status: Đang mượn -> Đã trả)
router.put('/:id', CheckLogin, CheckRole('admin'), async function(req, res) {
    try {
        let updatedItem = await borrowController.Update(req.params.id, req.body);
        if (!updatedItem) return res.status(404).send({ message: "Không tìm thấy phiếu mượn" });
        res.status(200).send(updatedItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// 5. Xóa phiếu mượn
router.delete('/:id', CheckLogin, CheckRole('admin'), async function(req, res) {
    try {
        let deletedItem = await borrowController.Delete(req.params.id);
        if (!deletedItem) return res.status(404).send({ message: "Không tìm thấy phiếu mượn" });
        res.status(200).send(deletedItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;