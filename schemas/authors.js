let mongoose = require('mongoose');

let authorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    biography: { type: String },
    birthYear: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema);