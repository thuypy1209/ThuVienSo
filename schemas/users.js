const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    role: {
        type: String,
        enum: ['Admin', 'Thủ thư', 'Độc giả'],
        default: 'Độc giả'
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre('save', function () {
    if (this.isModified("password")) {
        let salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }
});

userSchema.pre('findOneAndUpdate', function () {
    if (this._update.password) {
        let salt = bcrypt.genSaltSync(10);
        this._update.password = bcrypt.hashSync(this._update.password, salt);
    }
});

module.exports = mongoose.model('User', userSchema);