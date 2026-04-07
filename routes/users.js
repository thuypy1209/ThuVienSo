

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

// Đường dẫn file: routes/users.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, checkRole(['Admin', 'Thủ thư']), userController.getAllUsers);

router.post('/', verifyToken, checkRole(['Admin', 'Thủ thư']), userController.createUser);
router.put('/:id', verifyToken, checkRole(['Admin', 'Thủ thư']), userController.updateUser);
router.delete('/:id', verifyToken, checkRole(['Admin', 'Thủ thư']), userController.deleteUser);

module.exports = router;

