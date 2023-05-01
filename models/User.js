const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'User'
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: {
        createdAt,
        updatedAt
    }
});
const User = mongoose.model('User', UserSchema);
module.exports = User;