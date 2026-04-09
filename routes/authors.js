const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authors');

const { verifyToken, checkAdmin } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, authorController.getAllAuthors);
router.post('/', verifyToken, checkAdmin, authorController.createAuthor);
router.put('/:id', verifyToken, checkAdmin, authorController.updateAuthor);
router.delete('/:id', verifyToken, checkAdmin, authorController.deleteAuthor);

module.exports = router;