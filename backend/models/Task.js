const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true // Index for efficient user task queries
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['pending', 'in-progress', 'completed'],
        message: 'Status must be one of: pending, in-progress, completed'
      },
      default: 'pending',
      index: true // Index for filtering by status
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Create compound index on userId and status for efficient filtered queries
taskSchema.index({ userId: 1, status: 1 });

// Create text index on title for search functionality
taskSchema.index({ title: 'text' });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
