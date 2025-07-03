const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get token after 'Bearer '

  if (!token) {
    return res.status(403).json({ msg: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // attach user ID to req
    next();
  } catch (err) {
    res.status(403).json({ msg: 'Token is invalid.' });
  }
};

module.exports = verifyToken;