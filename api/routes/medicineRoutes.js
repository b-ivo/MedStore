const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getMedicines, getMedicineById, createMedicine, updateMedicine, deleteMedicine, getLowStock, getExpiring } = require('../controllers/medicineController');

router.get('/low-stock', protect, getLowStock);
router.get('/expiring', protect, getExpiring);

router.route('/')
  .get(protect, getMedicines)
  .post(protect, createMedicine);

router.route('/:id')
  .get(protect, getMedicineById)
  .put(protect, updateMedicine)
  .delete(protect, deleteMedicine);

module.exports = router;
