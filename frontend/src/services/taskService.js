import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for sending cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

export const taskService = {
  async createTask(taskData) {
    try {
      const response = await api.post('/api/tasks', taskData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create task'
      };
    }
  },

  async getTasks(queryParams = {}) {
    try {
      const response = await api.get('/api/tasks', { params: queryParams });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch tasks'
      };
    }
  },

  async updateTask(taskId, updates) {
    try {
      const response = await api.put(`/api/tasks/${taskId}`, updates);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update task'
      };
    }
  },

  async deleteTask(taskId) {
    try {
      const response = await api.delete(`/api/tasks/${taskId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete task'
      };
    }
  }
};
