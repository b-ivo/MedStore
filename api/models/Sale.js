const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  customerName: { type: String, default: 'Walk-in Customer' },
  items: [{
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    total: { type: Number }
  }],
  totalAmount: { type: Number, required: true },
  saleDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, enum: ['Cash', 'Card', 'Mobile Money'], default: 'Cash' },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
