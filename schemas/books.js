let mongoose = require("mongoose");

let bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
},
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "author", 
    required: true 
    },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "category",
    required: true 
},
  publisher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "publisher" 
},
  description: { 
    type: String, 
    default: "" 
},
  quantity: { 
    type: Number, 
    default: 0 
},
  availableQuantity: { 
    type: Number, 
    default: 0 
},
  coverUrl: { 
    type: String, default: "" 
},
  slug: { 
    type: String, 
    unique: true, 
    sparse: true 
},
  isDeleted: { 
    type: Boolean, 
    default: false 
}
}, { 
    timestamps: true 
});

module.exports = mongoose.model("book", bookSchema);