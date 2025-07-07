const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    //console.log('No token provided'); // Debug
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    //console.log('Token decoded, user ID:', decoded.id, 'Role:', decoded.role); // Debug
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      //console.log('User not found for token'); // Debug
      return res.status(401).json({ message: 'User not found' });
    }
    next();
  } catch (error) {
    console.error('Token verification error:', error.message, error.stack); // Debug
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Middleware to check user role
const restrictTo = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      //console.log('Access denied: Role mismatch, expected:', role, 'got:', req.user.role); // Debug
      return res.status(403).json({ message: 'Not authorized for this action' });
    }
    next();
  };
};

module.exports = { protect, restrictTo };