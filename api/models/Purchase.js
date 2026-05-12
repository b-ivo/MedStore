const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  items: [{
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    total: { type: Number }
  }],
  totalAmount: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Completed' },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
