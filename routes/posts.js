const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts');

const { upload } = require('../controllers/upload');

router.get('/', postController.getAllPosts);

router.post('/', upload.single('image'), postController.createPost);

router.put('/:id/like', postController.likePost);
router.post('/:id/comment', upload.single('file'), postController.commentPost);

module.exports = router;