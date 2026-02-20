import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const confessionService = {
  // Get all confessions
  getAll: (sortBy = 'newest', category = 'All') =>
    api.get('/confessions', {
      params: { sortBy, category },
    }),

  // Get single confession
  getById: (id) => api.get(`/confessions/${id}`),

  // Create confession
  create: (data) => api.post('/confessions', data),

  // Update confession
  update: (id, data) => api.put(`/confessions/${id}`, data),

  // Delete confession
  delete: (id, secretCode) =>
    api.delete(`/confessions/${id}`, { data: { secretCode } }),

  // Add reaction
  react: (id, reactionType) =>
    api.post(`/confessions/${id}/react`, { reactionType }),

  // Get user confessions
  getUserConfessions: () => api.get('/confessions/user/confessions/my'),
};

export const authService = {
  // Signup
  signup: (email, password, name) =>
    api.post('/auth/signup', { email, password, name }),

  // Login
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  // Get current user
  getCurrentUser: () => api.get('/auth/me'),

  // Logout
  logout: () => api.post('/auth/logout'),

  // Google login redirect
  googleLogin: () => {
    window.location.href = `${API_URL}/auth/google`;
  },
};

export default api;
