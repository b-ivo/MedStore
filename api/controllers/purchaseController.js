const Purchase = require('../models/Purchase');
const Medicine = require('../models/Medicine');

const getPurchases = async (req, res) => {
  try {
    const items = await Purchase.find({}).populate('items.medicine').populate('supplier').populate('recordedBy', 'fullName email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPurchase = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items' });
    }
    
    const purchaseData = new Purchase({
      ...req.body,
      recordedBy: req.user._id
    });

    const createdItem = await purchaseData.save();
    
    // Update stock
    for (const m of items) {
      const med = await Medicine.findById(m.medicine);
      if (med) {
        med.stockQuantity += m.quantity;
        await med.save();
      }
    }

    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPurchases, createPurchase };
