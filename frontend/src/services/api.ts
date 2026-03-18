import axios from 'axios';

// -----------------------------------------------------------------------------
// STRICT API CONFIGURATION
// -----------------------------------------------------------------------------
const SAFETY_OVERRIDE = "https://fitlytics-ip36.onrender.com/api";
const API_BASE = import.meta.env.VITE_API_URL || SAFETY_OVERRIDE;

console.log("🚀 API_BASE =", API_BASE);

// Hard fail if somehow both are missing (should not happen with SAFETY_OVERRIDE)
if (!API_BASE) {
  throw new Error("CRITICAL: VITE_API_URL is missing in production build");
}

const api = axios.create({
  baseURL: API_BASE.endsWith('/') ? API_BASE : `${API_BASE}/`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// -----------------------------------------------------------------------------
// PATH JOINING INTERCEPTOR
// -----------------------------------------------------------------------------
// This ensures that endpoints starting with '/' (e.g. '/auth/login') 
// do NOT drop the path part of the baseURL (the '/api' suffix).
api.interceptors.request.use((config) => {
  if (config.url?.startsWith('/')) {
    config.url = config.url.substring(1);
  }
  return config;
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fitlytics_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('fitlytics_token');
      localStorage.removeItem('fitlytics_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// User
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: {
    name?: string;
    weight?: number;
    height?: number;
    experienceLevel?: string;
  }) => api.put('/user/profile', data),
};

// Workouts
export const workoutAPI = {
  log: (data: {
    workoutType: string;
    muscleGroup?: string;
    exercises: { exercise: string; sets: number; reps: number; weight: number }[];
    cardio?: { type: string; duration: number; intensity: string };
  }) => api.post('/workouts/log', data),
  getAll: (page = 1, limit = 20) => api.get(`/workouts?page=${page}&limit=${limit}`),
  deleteWorkout: (id: string) => api.delete(`/workouts/${id}`),
};

// Analytics
export const analyticsAPI = {
  getInsights: () => api.get('/analytics/insights'),
  getHeatmap: () => api.get('/analytics/heatmap'),
  getPersonalRecords: () => api.get('/analytics/records'),
  getTimeline: (limit = 20) => api.get(`/analytics/timeline?limit=${limit}`),
  getExerciseProgress: (exercise: string) => api.get(`/analytics/exercise-progress/${exercise}`),
  getTrainingVolume: () => api.get('/analytics/training-volume'),
};

// Recovery
export const recoveryAPI = {
  getStatus: () => api.get('/recovery/status'),
};

// Plan
export const planAPI = {
  getPlans: () => api.get('/workout-plan'),
  createPlan: (data: any) => api.post('/workout-plan', data),
  deletePlan: (id: string) => api.delete(`/workout-plan/${id}`),
};

// Metric
export const metricAPI = {
  getMetrics: () => api.get('/body-metrics'),
  logMetrics: (data: any) => api.post('/body-metrics', data),
};

export const libraryAPI = {
  getExercises: () => api.get('/exercises'),
};

// Progress
export const progressAPI = {
  create: (data: any) => api.post('/progress', data),
  getAll: () => api.get('/progress'),
};

// Goals
export const goalAPI = {
  create: (data: any) => api.post('/goals', data),
  getAll: () => api.get('/goals'),
  update: (id: string, data: any) => api.put(`/goals/${id}`, data),
  delete: (id: string) => api.delete(`/goals/${id}`),
};

// Stats
export const statsAPI = {
  getDashboard: () => api.get('/stats/dashboard'),
};


// Recommendations
export const recommendationAPI = {
  getWorkout: () => api.get('/recommendations/workout'),
};

// Export
export const exportAPI = {
  workouts: (format: 'csv' | 'json') =>
    api.get(`/export/workouts?format=${format}`, {
      responseType: format === 'csv' ? 'blob' : 'json',
    }),
};

export default api;
