const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

router.route('/')
  .get(protect, getCategories)
  .post(protect, createCategory);

router.route('/:id')
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

module.exports = router;
