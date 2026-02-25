const Task = require('../models/Task');

/**
 * Create a new task
 * @route POST /api/tasks
 */
async function createTask(req, res) {
  try {
    const { title, description, status } = req.body;
    const userId = req.user.id; // From auth middleware
    
    // Create new task associated with authenticated user
    const task = new Task({
      userId,
      title,
      description,
      status
    });
    
    await task.save();
    
    // Return created task with 201 status
    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      statusCode: 201,
      data: {
        id: task._id,
        userId: task.userId,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Task creation error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Validation failed',
        statusCode: 400,
        details: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    
    // Generic server error
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'An error occurred while creating the task',
      statusCode: 500
    });
  }
}

/**
 * Get tasks for authenticated user with filtering, search, and pagination
 * @route GET /api/tasks
 */
async function getTasks(req, res) {
  try {
    const userId = req.user.id; // From auth middleware
    
    // Extract query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;
    
    // Build query object
    const query = { userId };
    
    // Add status filter if provided
    if (status) {
      query.status = status;
    }
    
    // Add search filter if provided (using text index)
    if (search) {
      query.$text = { $search: search };
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const tasks = await Task.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by newest first
    
    // Get total count for pagination metadata
    const totalCount = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    
    // Return tasks with pagination metadata
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: tasks.map(task => ({
        id: task._id,
        userId: task.userId,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
    
  } catch (error) {
    console.error('Task retrieval error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'An error occurred while retrieving tasks',
      statusCode: 500
    });
  }
}

/**
 * Get single task by ID
 * @route GET /api/tasks/:id
 */
async function getTaskById(req, res) {
  try {
    const userId = req.user.id; // From auth middleware
    const taskId = req.params.id;
    
    // Query task by ID and user ID to ensure ownership
    const task = await Task.findOne({ _id: taskId, userId });
    
    // Return 404 if not found
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Task not found',
        statusCode: 404
      });
    }
    
    // Return task data
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        id: task._id,
        userId: task.userId,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Task retrieval error:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Task not found',
        statusCode: 404
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'An error occurred while retrieving the task',
      statusCode: 500
    });
  }
}

/**
 * Update task by ID
 * @route PUT /api/tasks/:id
 */
async function updateTask(req, res) {
  try {
    const userId = req.user.id; // From auth middleware
    const taskId = req.params.id;
    const { title, description, status } = req.body;
    
    // Find task by ID first to check existence and ownership
    const task = await Task.findById(taskId);
    
    // Return 404 if task doesn't exist
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Task not found',
        statusCode: 404
      });
    }
    
    // Return 403 if task doesn't belong to authenticated user
    if (task.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'You are not authorized to update this task',
        statusCode: 403
      });
    }
    
    // Update specified fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    
    // Save updated task
    await task.save();
    
    // Return updated task data
    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      statusCode: 200,
      data: {
        id: task._id,
        userId: task.userId,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Task update error:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Task not found',
        statusCode: 404
      });
    }
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Validation failed',
        statusCode: 400,
        details: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'An error occurred while updating the task',
      statusCode: 500
    });
  }
}

/**
 * Delete task by ID
 * @route DELETE /api/tasks/:id
 */
async function deleteTask(req, res) {
  try {
    const userId = req.user.id; // From auth middleware
    const taskId = req.params.id;
    
    // Find task by ID first to check existence and ownership
    const task = await Task.findById(taskId);
    
    // Return 404 if task doesn't exist
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Task not found',
        statusCode: 404
      });
    }
    
    // Return 403 if task doesn't belong to authenticated user
    if (task.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'You are not authorized to delete this task',
        statusCode: 403
      });
    }
    
    // Delete task from database
    await Task.findByIdAndDelete(taskId);
    
    // Return success response with 200 status
    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      statusCode: 200
    });
    
  } catch (error) {
    console.error('Task deletion error:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Task not found',
        statusCode: 404
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'An error occurred while deleting the task',
      statusCode: 500
    });
  }
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
