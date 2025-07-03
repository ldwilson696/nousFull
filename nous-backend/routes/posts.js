const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// Mock post data (this will be dynamic later)
const posts = [
  { id: 1, title: 'Hello World', content: 'This is the first post.' },
  { id: 2, title: 'Second Post', content: 'Another example post.' },
];

// Protected: Create post
router.post('/create', verifyToken, (req, res) => {
  const { title, content } = req.body;
  const newPost = {
    id: posts.length + 1,
    title,
    content,
    user: req.user.id
  };
  posts.push(newPost);
  res.status(201).json({ msg: 'Post created', post: newPost });
});

// Public: Fetch all posts
router.get('/', (req, res) => {
  res.json({ posts });
});

module.exports = router;