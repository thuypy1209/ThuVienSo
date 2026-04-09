const express = require('express');
const router = express.Router();
const ebookController = require('../controllers/ebookFiles');

const {verifyToken} = require('../middlewares/authMiddleware');

router.get('/', verifyToken, ebookController.getAllEbooks);
router.post('/', ebookController.createEbook);
router.put('/:id', ebookController.updateEbook);
router.delete('/:id', ebookController.deleteEbook);

module.exports = router;