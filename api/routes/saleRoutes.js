const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getSales, createSale } = require('../controllers/saleController');

router.route('/')
  .get(protect, getSales)
  .post(protect, createSale);

module.exports = router;
