const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    address: { type: String },
    website: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Publisher', publisherSchema);