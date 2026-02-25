import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './TaskComponents.css';

const TaskForm = ({ onSubmit, initialTask = null, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!initialTask;

  // Populate form when editing
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setStatus(initialTask.status || 'pending');
    }
  }, [initialTask]);

  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    // Description validation
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length > 2000) {
      newErrors.description = 'Description must be 2000 characters or less';
    }

    // Status validation
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      newErrors.status = 'Invalid status value';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      status
    };

    try {
      await onSubmit(taskData);
      
      // Reset form if creating new task
      if (!isEditMode) {
        setTitle('');
        setDescription('');
        setStatus('pending');
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to save task' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setStatus('pending');
    setErrors({});
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="task-form-container">
      <h3>{isEditMode ? 'Edit Task' : 'Create New Task'}</h3>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            maxLength={200}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && (
            <span id="title-error" className="error-message">
              {errors.title}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            maxLength={2000}
            rows={4}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'description-error' : undefined}
          />
          {errors.description && (
            <span id="description-error" className="error-message">
              {errors.description}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isSubmitting}
            aria-invalid={!!errors.status}
            aria-describedby={errors.status ? 'status-error' : undefined}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {errors.status && (
            <span id="status-error" className="error-message">
              {errors.status}
            </span>
          )}
        </div>

        {errors.submit && (
          <div className="error-message submit-error">
            {errors.submit}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Task' : 'Create Task')}
          </button>
          {isEditMode && (
            <button type="button" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

TaskForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialTask: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string
  }),
  onCancel: PropTypes.func
};

export default TaskForm;
