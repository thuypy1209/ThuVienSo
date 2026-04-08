var express = require("express");
var router = express.Router();
let categoriesController = require('../controllers/categories');
let {CheckLogin,CheckRole} = require('../utils/authHandler')



router.get('/', async (req, res) => {
    try { res.status(200).send(await categoriesController.GetAllCategories()); } 
    catch (e) { res.status(500).send({ message: e.message }); }
});

router.get('/:id', async (req, res) => {
    try { 
        let item = await categoriesController.GetCategoryById(req.params.id);
        if(item) res.status(200).send(item); else res.status(404).send({ message: 'Không tìm thấy' });
    } catch (e) { res.status(500).send({ message: e.message }); }
});

// Chỗ này bắt buộc phải có CheckLogin đứng trước CheckRole
router.post('/', CheckLogin, CheckRole('admin'), async (req, res) => {
    try { res.status(201).send(await categoriesController.CreateCategory(req.body)); } 
    catch (e) { res.status(400).send({ message: e.message }); }
});

router.put('/:id', CheckLogin, CheckRole('admin'), async (req, res) => {
    try {
        let updated = await categoriesController.UpdateCategory(req.params.id, req.body);
        if(!updated) return res.status(404).send({ message: 'Không tìm thấy' });
        res.status(200).send(updated);
    } catch (e) { res.status(400).send({ message: e.message }); }
});

router.delete('/:id', CheckLogin, CheckRole('admin'), async (req, res) => {
    try {
        let deleted = await categoriesController.DeleteCategory(req.params.id);
        if(!deleted) return res.status(404).send({ message: 'Không tìm thấy' });
        res.status(200).send(deleted);
    } catch (e) { res.status(400).send({ message: e.message }); }
});

module.exports = router;