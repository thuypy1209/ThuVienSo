let mongoose = require("mongoose");
let publisherSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true },
  address: { 
    type: String, 
    default: "" },
  slug: { 
    type: String, 
    unique: true, 
    sparse: true },
  isDeleted: { 
    type: Boolean, 
    default: false }
}, { 
    timestamps: true });
module.exports = mongoose.model("publisher", publisherSchema);