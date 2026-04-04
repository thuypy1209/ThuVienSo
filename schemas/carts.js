const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    // Cột 1: ID của người dùng
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Cột 2: ID của cuốn sách
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Cart', cartSchema);