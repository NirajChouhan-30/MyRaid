const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const { validateTaskCreation, validateTaskUpdate } = require('../middleware/validation');
const authenticate = require('../middleware/auth');

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post('/', authenticate, validateTaskCreation, createTask);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for authenticated user with filtering, search, and pagination
 * @access  Private
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10)
 * @query   status - Filter by status (pending, in-progress, completed)
 * @query   search - Search by title
 */
router.get('/', authenticate, getTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get single task by ID
 * @access  Private
 */
router.get('/:id', authenticate, getTaskById);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task by ID
 * @access  Private
 */
router.put('/:id', authenticate, validateTaskUpdate, updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task by ID
 * @access  Private
 */
router.delete('/:id', authenticate, deleteTask);

module.exports = router;
