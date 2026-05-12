const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getPurchases, createPurchase } = require('../controllers/purchaseController');

router.route('/')
  .get(protect, getPurchases)
  .post(protect, createPurchase);

module.exports = router;
