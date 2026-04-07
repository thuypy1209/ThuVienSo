const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlists');

router.post('/', wishlistController.addToWishlist);


router.get('/:userId', wishlistController.getWishlistByUser);


router.delete('/:id', wishlistController.removeFromWishlist);

module.exports = router;
