let mongoose = require("mongoose");

let postSchema = new mongoose.Schema({
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: true },
    content: { 
        type: String, 
        required: true },
    image: { 
        type: String,
        default: "" 
    }, 
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }], // Danh sách người thích
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
        text: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);