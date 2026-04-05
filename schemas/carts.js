let mongoose = require('mongoose');

let cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Cart', cartSchema);