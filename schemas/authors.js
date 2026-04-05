let mongoose = require("mongoose");
let authorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true },
  bio: { 
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
module.exports = mongoose.model("author", authorSchema);