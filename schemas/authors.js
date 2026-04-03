const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    biography: { type: String },
    birthYear: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema);