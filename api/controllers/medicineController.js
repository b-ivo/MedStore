const Medicine = require('../models/Medicine');

const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({}).populate('category').populate('supplier');
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate('category').populate('supplier');
    if (medicine) res.json(medicine);
    else res.status(404).json({ message: 'Medicine not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMedicine = async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    const createdMedicine = await medicine.save();
    res.status(201).json(createdMedicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (medicine) {
      Object.assign(medicine, req.body);
      const updatedMedicine = await medicine.save();
      res.json(updatedMedicine);
    } else {
      res.status(404).json({ message: 'Medicine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (medicine) {
      await medicine.deleteOne();
      res.json({ message: 'Medicine removed' });
    } else {
      res.status(404).json({ message: 'Medicine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLowStock = async (req, res) => {
  try {
    const medicines = await Medicine.find({ $expr: { $lte: ['$stockQuantity', '$reorderLevel'] } }).populate('category').populate('supplier');
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExpiring = async (req, res) => {
  try {
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
    const medicines = await Medicine.find({ expiryDate: { $lte: ninetyDaysFromNow } }).populate('category').populate('supplier');
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMedicines, getMedicineById, createMedicine, updateMedicine, deleteMedicine, getLowStock, getExpiring };
