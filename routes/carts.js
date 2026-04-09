const express = require('express');
const router = express.Router();
const cartController = require('../controllers/carts');

const {verifyToken} = require('../middlewares/authMiddleware');

router.post('/', verifyToken, cartController.addToCart);

router.get('/:userId', verifyToken, cartController.getCartByUser);

router.delete('/:id', verifyToken, cartController.removeFromCart);
router.put('/:id', verifyToken, cartController.updateQuantity);

module.exports = router;