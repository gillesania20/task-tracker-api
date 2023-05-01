const mongoose = require('mongoose');
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
        createdAt,
        updatedAt
    }
});
const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;