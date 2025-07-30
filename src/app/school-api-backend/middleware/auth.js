// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token'); // Or 'Authorization' if you use 'Bearer TOKEN'

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied', messageTa: 'டோக்கன் இல்லை, அங்கீகாரம் மறுக்கப்பட்டது' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // Attach user ID to the request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid', messageTa: 'டோக்கன் செல்லுபடியாகவில்லை' });
  }
};