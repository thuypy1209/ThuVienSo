const express = require('express');
const router = express.Router();

const { 
    getAllBooks, 
    createBook, 
    updateBook, 
    deleteBook, 
    getBookById 
} = require('../controllers/books');

const { verifyToken, checkAdmin } = require('../middlewares/authMiddleware');

router.get('/', getAllBooks);
router.get('/:id', getBookById);

router.post('/', verifyToken, checkAdmin, createBook);
router.put('/:id', verifyToken, checkAdmin, updateBook);
router.delete('/:id', verifyToken, checkAdmin, deleteBook);

module.exports = router;