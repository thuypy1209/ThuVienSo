const mongoose = require('mongoose');

const ebookFileSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    fileUrl: { type: String, required: true },
    format: { type: String, enum: ['PDF', 'EPUB'], default: 'PDF' }
}, { timestamps: true });

module.exports = mongoose.model('EbookFile', ebookFileSchema);