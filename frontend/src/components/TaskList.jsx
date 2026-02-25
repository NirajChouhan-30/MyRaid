import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TaskItem from './TaskItem';
import './TaskComponents.css';

const TaskList = ({ tasks, onEdit, onDelete, loading, error, pagination, onPageChange, onFilterChange, onSearchChange }) => {
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Notify parent of search changes
  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, onSearchChange]);

  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    if (onFilterChange) {
      onFilterChange(value);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  if (loading) {
    return (
      <div className="task-list-container">
        <div className="loading-state">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-list-container">
        <div className="error-state">
          <p>Error loading tasks: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-controls">
        <div className="search-box">
          <label htmlFor="search">Search tasks:</label>
          <input
            type="text"
            id="search"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search tasks by title"
          />
        </div>

        <div className="filter-box">
          <label htmlFor="status-filter">Filter by status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            aria-label="Filter tasks by status"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found. Create your first task to get started!</p>
        </div>
      ) : (
        <>
          <div className="task-list">
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="pagination-controls">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                aria-label="Previous page"
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {pagination.currentPage} of {pagination.totalPages}
                {' '}({pagination.totalCount} total tasks)
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    totalCount: PropTypes.number
  }),
  onPageChange: PropTypes.func,
  onFilterChange: PropTypes.func,
  onSearchChange: PropTypes.func
};

export default TaskList;
