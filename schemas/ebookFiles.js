let mongoose = require("mongoose");
let ebookFileSchema = new mongoose.Schema({
  book: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "book", 
    required: true },
  fileUrl: { 
    type: String, required: true },
  fileType: { 
    type: String, default: "pdf" },
  fileSize: { 
    type: Number },
  isDeleted: { 
    type: Boolean, default: false }
}, { 
    timestamps: true });
module.exports = mongoose.model("ebookFile", ebookFileSchema);