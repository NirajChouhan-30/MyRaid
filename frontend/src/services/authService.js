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

export const authService = {
  async register(username, email, password) {
    try {
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  async login(email, password) {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  },

  async logout() {
    try {
      await api.post('/api/auth/logout');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Logout failed'
      };
    }
  }
};
