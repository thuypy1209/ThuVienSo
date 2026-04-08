var express = require("express");
var router = express.Router();
let authorController = require('../controllers/authors');
let { CheckLogin, CheckRole } = require('../utils/authHandler');

// 1. GET: Lấy danh sách tất cả tác giả (Phải có async/await và res.send)
router.get('/', async function (req, res) {
    try {
        let items = await authorController.GetAllAuthors(); // Gọi hàm GetAll trong Controller
        res.status(200).send(items); // Trả dữ liệu về cho Postman/Frontend
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 2. GET: Lấy chi tiết 1 tác giả theo ID
router.get('/:id', async function (req, res) {
    try {
        let item = await authorController.GetAuthorById(req.params.id);
        if (item) res.status(200).send(item);
        else res.status(404).send({ message: "Không tìm thấy tác giả" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// 3. POST: Thêm tác giả (Chỉ Admin)
router.post('/', CheckLogin, CheckRole('admin'), async function (req, res) {
    try {
        let newItem = await authorController.createAuthor(req.body);
        res.status(201).send(newItem);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

// 4. PUT: Cập nhật tác giả (Chỉ Admin)
router.put('/:id', CheckLogin, CheckRole('admin'), async function (req, res) {
    try {
        let updatedItem = await authorController.updateAuthor(req.params.id, req.body);
        if (!updatedItem) return res.status(404).send({ message: "Không tìm thấy tác giả" });
        res.status(200).send(updatedItem);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

// 5. DELETE: Xóa tác giả (Chỉ Admin)
router.delete('/:id', CheckLogin, CheckRole('admin'), async function (req, res) {
    try {
        let deletedItem = await authorController.deleteAuthor(req.params.id);
        if (!deletedItem) return res.status(404).send({ message: "Không tìm thấy tác giả" });
        res.status(200).send(deletedItem);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
})

module.exports = router;