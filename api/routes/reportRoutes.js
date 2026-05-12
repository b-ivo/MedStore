const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDashboardStats, getSalesReport } = require('../controllers/reportController');

router.get('/dashboard', protect, getDashboardStats);
router.get('/sales', protect, getSalesReport);

module.exports = router;
