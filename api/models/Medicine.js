const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  batchNumber: { type: String, required: true },
  stockQuantity: { type: Number, required: true, default: 0 },
  reorderLevel: { type: Number, required: true, default: 10 },
  price: { type: Number, required: true },
  expiryDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
