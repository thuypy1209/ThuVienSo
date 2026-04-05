const express = require('express');
const router = express.Router();
const recordController = require('../controllers/borrowRecords');

router.get('/', recordController.getAllRecords);
router.post('/', recordController.createRecord);
router.put('/:id', recordController.updateRecord);
router.delete('/:id', recordController.deleteRecord);

module.exports = router;