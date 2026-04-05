const express = require('express');
const router = express.Router();
const ebookController = require('../controllers/ebookFiles');

router.get('/', ebookController.getAllEbooks);
router.post('/', ebookController.createEbook);
router.put('/:id', ebookController.updateEbook);
router.delete('/:id', ebookController.deleteEbook);

module.exports = router;