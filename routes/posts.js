const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts');
const { upload } = require('../controllers/upload');

router.post('/', upload.single('image'), postController.createPost);
router.get('/', postController.getAllPosts);
router.put('/:id/like', postController.likePost);
router.post('/:id/comment', upload.single('image'), postController.commentPost);

module.exports = router;