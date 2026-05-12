const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getUsers, updateUser, deleteUser, updateProfile } = require('../controllers/userController');
const { registerUser } = require('../controllers/authController');

router.route('/')
  .get(protect, admin, getUsers)
  .post(protect, admin, registerUser);

router.route('/me').put(protect, updateProfile);

router.route('/:id')
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
