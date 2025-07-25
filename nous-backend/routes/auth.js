const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');
const upload = require('../middleware/upload');

// ======= REGISTER ROUTE =======
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  const savedUser = await newUser.save();
  res.status(201).json({ msg: 'User registered', userId: savedUser._id });
});

// ======= LOGIN ROUTE =======
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ======= PROTECTED PROFILE ROUTE =======
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // If user has a profileImage, prepend the static path
    if (user.profileImage) {
      user.profileImage = `http://localhost:8000/uploads/${user.profileImage}`;
    }

    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});
// ======= UPDATE PROFILE ROUTE =======

router.put(
  '/update-profile',
  [verifyToken, upload.single('profileImage')],
  async (req, res) => {
    try {
      const { username, email, bio, location, occupation } = req.body;
      const updateData = { username, email, bio, location, occupation };

      if (req.file) {
        updateData.profileImage = `/uploads/${req.file.filename}`; // <-- IMPORTANT
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true }
      );

      res.json({ message: 'Profile updated', user: updatedUser });
    } catch (err) {
      console.error('Update error:', err);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
);

module.exports = router;
