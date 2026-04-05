let mongoose = require("mongoose");
let wishlistSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", 
    required: true, 
    unique: true 
},
  books: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "book" }]
}, { 
    timestamps: true 
});
module.exports = mongoose.model("wishlist", wishlistSchema);