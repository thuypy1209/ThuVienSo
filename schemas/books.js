const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String },
    publishedYear: { type: Number },
    coverImage: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    price: { type: Number, required: true, default: 50000 },
    stock: { type: Number, default: 10 }
}, { timestamps: true });
module.exports = mongoose.model('Book', bookSchema);