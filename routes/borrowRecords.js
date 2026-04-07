const express = require('express');
const router = express.Router();
const recordController = require('../controllers/borrowRecords');

router.post('/checkout-cart', recordController.checkoutCart);

router.get('/my-history/:userId', recordController.getMyHistory);

module.exports = router;