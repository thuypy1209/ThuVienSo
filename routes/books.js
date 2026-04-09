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

router.get('/', verifyToken,  getAllBooks);
router.get('/:id',verifyToken, getBookById);

router.post('/', verifyToken, checkAdmin, createBook);
router.put('/:id', verifyToken, checkAdmin, updateBook);
router.delete('/:id', verifyToken, checkAdmin, deleteBook);
router.get('/:id/ownership', verifyToken, async (req, res) => {
    const Purchase = require('../schemas/purchases');
    const hasPurchase = await Purchase.findOne({ user: req.user.id, book: req.params.id });
    res.json({ success: true, hasPurchase: !!hasPurchase });
});

module.exports = router;