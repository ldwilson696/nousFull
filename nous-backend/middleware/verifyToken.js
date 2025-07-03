const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Format should be: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied: No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yoursecretkey');
    req.user = decoded; // Attach user info to request object
    next(); // Continue to the next middleware or route handler
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;