const Sale = require('../models/Sale');
const Medicine = require('../models/Medicine');

const getSales = async (req, res) => {
  try {
    const items = await Sale.find({}).populate('items.medicine').populate('processedBy', 'fullName email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSale = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items' });
    }
    
    // Validate stock before processing
    for (const m of items) {
      const med = await Medicine.findById(m.medicine);
      if (!med) return res.status(404).json({ message: `Medicine not found` });
      if (med.stockQuantity < m.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${med.name}` });
      }
    }

    const saleData = new Sale({
      ...req.body,
      processedBy: req.user._id
    });

    const createdItem = await saleData.save();
    
    // Update stock
    for (const m of items) {
      const med = await Medicine.findById(m.medicine);
      if (med) {
        med.stockQuantity -= m.quantity;
        await med.save();
      }
    }

    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSales, createSale };
