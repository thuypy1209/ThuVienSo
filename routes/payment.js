const express = require('express');
const router = express.Router();
const { handleReturn, handleIpn } = require('../controllers/payment');
router.get('/return', handleReturn);
router.post('/ipn', handleIpn);
module.exports = router;