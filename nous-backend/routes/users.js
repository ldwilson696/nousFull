const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// Mock post data (this will be dynamic later)
const posts = [
  { id: 1, title: 'Hello World', content: 'This is the first post.' },
  { id: 2, title: 'Second Post', content: 'Another example post.' },
];

//  Get User (Verify Token Protection Unused)
// Example GET route
router.get('/', (req, res) => {
  res.json({ msg: 'User route operational' });
});

module.exports = router;