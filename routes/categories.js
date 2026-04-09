const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categories'); 

const { verifyToken, checkAdmin } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, categoryController.getAllCategories);

router.post('/', verifyToken, checkAdmin, categoryController.createCategory);
router.put('/:id', verifyToken, checkAdmin, categoryController.updateCategory);
router.delete('/:id', verifyToken, checkAdmin, categoryController.deleteCategory);

module.exports = router;