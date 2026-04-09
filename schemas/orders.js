const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    shippingFee: { type: Number, default: 30000 },
    grandTotal: { type: Number, required: true },
    customerName: String,
    phone: String,
    email: String,
    address: String,
    paymentMethod: { type: String, enum: ['cod', 'momo'], required: true },
    status: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'COMPLETED'], default: 'PENDING' },
    momoOrderId: String
}, { timestamps: true });
module.exports = mongoose.model('Order', orderSchema);