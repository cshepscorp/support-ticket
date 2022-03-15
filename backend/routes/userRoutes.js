const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// app.use('/api/users', require('./routes/userRoutes')); defined in server.js
router.post('/', registerUser);

router.post('/login', loginUser);

router.get('/me', protect, getMe);
router.get('/', getAllUsers);

module.exports = router;
