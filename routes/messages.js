const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messages');

router.get('/', messageController.getChatHistory);

module.exports = router;