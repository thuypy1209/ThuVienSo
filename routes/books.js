const express = require('express');
const router = express.Router();
const bookController = require('../controllers/books');

const { verifyToken, checkLibrarianOrAdmin } = require('../middlewares/authMiddleware');

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', verifyToken, checkLibrarianOrAdmin, bookController.createBook);
router.put('/:id', verifyToken, checkLibrarianOrAdmin, bookController.updateBook);
router.delete('/:id', verifyToken, checkLibrarianOrAdmin, bookController.deleteBook);

module.exports = router;