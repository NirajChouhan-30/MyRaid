import { useEffect } from 'react';
import PropTypes from 'prop-types';
import './TaskComponents.css';

const Notification = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
      default:
        return '✓';
    }
  };

  return (
    <div className={`notification ${type}`} role="alert">
      <span className="notification-icon">{getIcon()}</span>
      <span className="notification-message">{message}</span>
      <button 
        className="notification-close" 
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'info']),
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number
};

export default Notification;
