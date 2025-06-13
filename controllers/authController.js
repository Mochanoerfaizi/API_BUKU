// controllers/authController.js
const { googleAuth } = require('../middleware/authMiddleware');

// Endpoint untuk Google Login
exports.loginGoogle = googleAuth;