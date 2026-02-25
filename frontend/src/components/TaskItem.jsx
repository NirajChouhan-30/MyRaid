import { useState } from 'react';
import PropTypes from 'prop-types';
import './TaskComponents.css';

const TaskItem = ({ task, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'in-progress':
        return 'status-in-progress';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(task._id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="task-item">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`task-status ${getStatusClass(task.status)}`}>
          {getStatusLabel(task.status)}
        </span>
      </div>
      
      <p className="task-description">{task.description}</p>
      
      <div className="task-footer">
        <span className="task-date">
          Created: {formatDate(task.createdAt)}
        </span>
        
        <div className="task-actions">
          {!showDeleteConfirm ? (
            <>
              <button 
                className="btn-edit" 
                onClick={() => onEdit(task)}
                aria-label={`Edit task: ${task.title}`}
              >
                Edit
              </button>
              <button 
                className="btn-delete" 
                onClick={handleDeleteClick}
                aria-label={`Delete task: ${task.title}`}
              >
                Delete
              </button>
            </>
          ) : (
            <div className="delete-confirm">
              <span>Delete this task?</span>
              <button 
                className="btn-confirm" 
                onClick={handleConfirmDelete}
                aria-label="Confirm delete"
              >
                Yes
              </button>
              <button 
                className="btn-cancel" 
                onClick={handleCancelDelete}
                aria-label="Cancel delete"
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

TaskItem.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default TaskItem;
