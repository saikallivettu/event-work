const express = require('express');
const router = express.Router();
const { getPosts, createPost, addReply } = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');

// List posts (optionally by course via ?course=ID)
router.get('/', protect, getPosts);

// Create a new post
router.post('/', protect, createPost);

// Add a reply to a post
router.post('/:id/replies', protect, addReply);

module.exports = router;
