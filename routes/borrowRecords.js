const express = require('express');
const router = express.Router();
const recordController = require('../controllers/borrowRecords');

const {verifyToken} = require('../middlewares/authMiddleware');

router.post('/checkout-cart', verifyToken, recordController.checkoutCart);

router.get('/my-history/:userId', verifyToken, recordController.getMyHistory);

module.exports = router;