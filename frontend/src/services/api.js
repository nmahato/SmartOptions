import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
};

// Options API
export const optionsAPI = {
  getStocks: () => api.get('/options/stocks/'),
  getOptionsChain: (symbol) => api.get(`/options/chains/by_symbol/?symbol=${symbol}`),
};

// Strategies API
export const strategiesAPI = {
  getUserStrategies: () => api.get('/strategies/user-strategies/'),
  createStrategy: (strategy) => api.post('/strategies/user-strategies/', strategy),
  getPayoff: (strategyId) => api.get(`/strategies/user-strategies/${strategyId}/payoff/`),
};

// Set auth token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;