const express = require('express');
const router = express.Router();
const cartController = require('../controllers/carts');

router.post('/', cartController.addToCart);

router.get('/:userId', cartController.getCartByUser);

router.delete('/:id', cartController.removeFromCart);

module.exports = router;