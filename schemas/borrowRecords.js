const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['Đang mượn', 'Đã trả', 'Quá hạn'], default: 'Đang mượn' }
}, { timestamps: true });

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);