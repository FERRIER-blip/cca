import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Injecte le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Gestion de l'expiration du token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (email: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    return api.post('/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateMe: (data: any) => api.put('/auth/me', data),
};

// ─── Trainings (LMS) ─────────────────────────────────────────────────────────
export const trainingsAPI = {
  getAll: () => api.get('/trainings/'),
  getAdminAll: () => api.get('/trainings/admin/all'),
  getBySlug: (slug: string) => api.get(`/trainings/${slug}`),
  create: (data: any) => api.post('/trainings/', data),
  update: (id: number, data: any) => api.put(`/trainings/${id}`, data),
  delete: (id: number) => api.delete(`/trainings/${id}`),
  enroll: (trainingId: number) => api.post('/trainings/enroll', { training_id: trainingId }),
  getMyEnrollments: () => api.get('/trainings/my/enrollments'),
};

// ─── Progress ────────────────────────────────────────────────────────────────
export const progressAPI = {
  completeModule: (moduleId: number) => api.post(`/progress/update/${moduleId}`),
  getTrainingStatus: (trainingId: number) => api.get(`/progress/status/${trainingId}`),
};

// ─── Services ────────────────────────────────────────────────────────────────
export const servicesAPI = {
  getAll: () => api.get('/services/'),
  getBySlug: (slug: string) => api.get(`/services/${slug}`),
  create: (data: any) => api.post('/services/', data),
  update: (id: number, data: any) => api.put(`/services/${id}`, data),
  delete: (id: number) => api.delete(`/services/${id}`),
};

// ─── Experts ─────────────────────────────────────────────────────────────────
export const expertsAPI = {
  getAll: () => api.get('/experts/'),
  getById: (id: number) => api.get(`/experts/${id}`),
  create: (data: any) => api.post('/experts/', data),
  update: (id: number, data: any) => api.put(`/experts/${id}`, data),
  delete: (id: number) => api.delete(`/experts/${id}`),
};

// ─── Testimonials (CORRIGÉ - ÉTAIT MANQUANT) ──────────────────────────────────
export const testimonialsAPI = {
  getAll: () => api.get('/testimonials/'),
  
  getFeatured: () => api.get('/testimonials/featured'),
  
  create: (data: Partial<Testimonial>) => api.post('/testimonials/', data),
  
  // Idem pour la mise à jour
  update: (id: number, data: Partial<Testimonial>) => api.put(`/testimonials/${id}`, data),
  
  approve: (id: number) => api.put(`/testimonials/${id}`, { is_approved: true }),
  
  delete: (id: number) => api.delete(`/testimonials/${id}`),
};

// ─── News (CORRIGÉ - ÉTAIT MANQUANT) ──────────────────────────────────────────
export const newsAPI = {
  getAll: () => api.get('/news/'),
  getBySlug: (slug: string) => api.get(`/news/${slug}`),
  create: (data: any) => api.post('/news/', data),
  update: (id: number, data: any) => api.put(`/news/${id}`, data),
  delete: (id: number) => api.delete(`/news/${id}`),
};

// ─── Partners (CORRIGÉ - ÉTAIT MANQUANT) ──────────────────────────────────────
export const partnersAPI = {
  getAll: () => api.get('/partners/'),
  
  // 👉 LA LIGNE QUI MANQUAIT POUR LA PAGE D'ACCUEIL :
  getFeatured: () => api.get('/partners/featured'),
  
  create: (data: any) => api.post('/partners/', data),
  update: (id: number, data: any) => api.put(`/partners/${id}`, data),
  delete: (id: number) => api.delete(`/partners/${id}`),
};

// ─── Contact ─────────────────────────────────────────────────────────────────
export const contactAPI = {
  sendMessage: (data: any) => api.post('/contact/message', data),
  getMessages: () => api.get('/contact/messages'),
  markAsRead: (id: number) => api.put(`/contact/messages/${id}/read`),
  deleteMessage: (id: number) => api.delete(`/contact/messages/${id}`),
  createServiceRequest: (data: any) => api.post('/contact/service-request', data),
  getServiceRequests: () => api.get('/contact/service-requests'),
  updateServiceRequest: (id: number, status: string) => api.put(`/contact/service-requests/${id}?status=${status}`),
};

// ─── Admin ───────────────────────────────────────────────────────────────────
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  toggleUserStatus: (id: number) => api.put(`/admin/users/${id}/toggle-status`),
  toggleUserAdmin: (id: number) => api.put(`/admin/users/${id}/toggle-admin`),
  deleteUser: (id: number) => api.delete(`/admin/users/${id}`),
};