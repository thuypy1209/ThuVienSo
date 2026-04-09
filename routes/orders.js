const express = require('express');
const router = express.Router();
const { submitOrder, testMoMoSuccess} = require('../controllers/orders');
const { verifyToken } = require('../middlewares/authMiddleware');
router.post('/submit', verifyToken, submitOrder);
router.post('/test-momo-success', verifyToken, testMoMoSuccess);

module.exports = router;