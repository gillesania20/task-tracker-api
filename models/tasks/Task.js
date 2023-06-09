const mongoose = require('mongoose');
const User = require('./../users/User');
const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,
        required: false
    },
    user: {
        type: mongoose.ObjectId,
        ref: User
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
TaskSchema.index({ title: 1, user: 1 }, { unique: true }); //unique compounded index
const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;