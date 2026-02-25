import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Notification from '../components/Notification';
import { taskService } from '../services/taskService';

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Show notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // Close notification
  const closeNotification = () => {
    setNotification(null);
  };

  // Fetch tasks with current filters
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    const queryParams = {
      page: currentPage,
      limit: 10
    };

    if (statusFilter) {
      queryParams.status = statusFilter;
    }

    if (searchTerm) {
      queryParams.search = searchTerm;
    }

    const result = await taskService.getTasks(queryParams);

    if (result.success) {
      // Backend returns data array and pagination object
      // Map id to _id for frontend compatibility
      const tasksWithId = (result.data.data || []).map(task => ({
        ...task,
        _id: task.id || task._id
      }));
      setTasks(tasksWithId);
      setPagination(result.data.pagination || null);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  // Fetch tasks on mount and when filters change
  useEffect(() => {
    fetchTasks();
  }, [currentPage, statusFilter, searchTerm]);

  // Handle task creation
  const handleCreateTask = async (taskData) => {
    const result = await taskService.createTask(taskData);

    if (result.success) {
      setShowForm(false);
      showNotification('Task created successfully!', 'success');
      // Refresh task list
      await fetchTasks();
    } else {
      throw new Error(result.error);
    }
  };

  // Handle task update
  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;

    const result = await taskService.updateTask(editingTask._id, taskData);

    if (result.success) {
      setEditingTask(null);
      showNotification('Task updated successfully!', 'success');
      // Refresh task list
      await fetchTasks();
    } else {
      throw new Error(result.error);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    const result = await taskService.deleteTask(taskId);

    if (result.success) {
      showNotification('Task deleted successfully!', 'success');
      // Refresh task list
      await fetchTasks();
    } else {
      setError(result.error);
      showNotification(result.error || 'Failed to delete task', 'error');
    }
  };

  // Handle edit button click
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(false);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle search change
  const handleSearchChange = (search) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="tasks-page">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      
      <div className="tasks-header">
        <h1>My Tasks</h1>
        <p>Welcome, {user?.username || user?.email}!</p>
      </div>

      {/* Show create form or edit form */}
      {editingTask ? (
        <TaskForm
          onSubmit={handleUpdateTask}
          initialTask={editingTask}
          onCancel={handleCancelEdit}
        />
      ) : showForm ? (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <div className="create-task-section">
          <button 
            className="btn-create-task"
            onClick={() => setShowForm(true)}
          >
            + Create New Task
          </button>
        </div>
      )}

      {/* Task list */}
      <TaskList
        tasks={tasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={handlePageChange}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
      />
    </div>
  );
};

export default TasksPage;
