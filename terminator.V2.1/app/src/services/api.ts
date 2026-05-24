import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Injecte le token JWT automatiquement sur chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Redirige vers /login si token expiré / invalide
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Évite une boucle infinie si déjà sur /login
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
  /**
   * FastAPI OAuth2PasswordRequestForm attend application/x-www-form-urlencoded,
   * PAS du JSON. On envoie donc un URLSearchParams.
   */
  login: (email: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    return api.post('/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  register:  (data: any) => api.post('/auth/register', data),
  getMe:     ()          => api.get('/auth/me'),
  updateMe:  (data: any) => api.put('/auth/me', data),
};

// ─── Services ─────────────────────────────────────────────────────────────────
export const servicesAPI = {
  getAll:      ()                        => api.get('/services/'),
  getBySlug:   (slug: string)            => api.get(`/services/${slug}`),
  create:      (data: any)               => api.post('/services/', data),
  update:      (id: number, data: any)   => api.put(`/services/${id}`, data),
  delete:      (id: number)              => api.delete(`/services/${id}`),
};

// ─── Trainings ────────────────────────────────────────────────────────────────
export const trainingsAPI = {
  getAll:          ()                        => api.get('/trainings/'),
  getBySlug:       (slug: string)            => api.get(`/trainings/${slug}`),
  create:          (data: any)               => api.post('/trainings/', data),
  update:          (id: number, data: any)   => api.put(`/trainings/${id}`, data),
  delete:          (id: number)              => api.delete(`/trainings/${id}`),
  enroll:          (trainingId: number)      => api.post('/trainings/enroll', { training_id: trainingId }),
  getMyEnrollments: ()                       => api.get('/trainings/my/enrollments'),
};

// ─── Experts ──────────────────────────────────────────────────────────────────
export const expertsAPI = {
  getAll:  ()                        => api.get('/experts/'),
  getById: (id: number)              => api.get(`/experts/${id}`),
  create:  (data: any)               => api.post('/experts/', data),
  update:  (id: number, data: any)   => api.put(`/experts/${id}`, data),
  delete:  (id: number)              => api.delete(`/experts/${id}`),
};

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const testimonialsAPI = {
  getAll:      ()                        => api.get('/testimonials/'),
  getFeatured: ()                        => api.get('/testimonials/featured'),
  create:      (data: any)               => api.post('/testimonials/', data),
  update:      (id: number, data: any)   => api.put(`/testimonials/${id}`, data),
  delete:      (id: number)              => api.delete(`/testimonials/${id}`),
};

// ─── Partners ─────────────────────────────────────────────────────────────────
export const partnersAPI = {
  getAll:  ()                        => api.get('/partners/'),
  create:  (data: any)               => api.post('/partners/', data),
  update:  (id: number, data: any)   => api.put(`/partners/${id}`, data),
  delete:  (id: number)              => api.delete(`/partners/${id}`),
};

// ─── News ─────────────────────────────────────────────────────────────────────
export const newsAPI = {
  getAll:    ()                        => api.get('/news/'),
  getBySlug: (slug: string)            => api.get(`/news/${slug}`),
  create:    (data: any)               => api.post('/news/', data),
  update:    (id: number, data: any)   => api.put(`/news/${id}`, data),
  delete:    (id: number)              => api.delete(`/news/${id}`),
};

// ─── Contact ──────────────────────────────────────────────────────────────────
export const contactAPI = {
  // --- MESSAGES DE CONTACT ---
  sendMessage: (data: any) => 
    api.post('/contact/message', data),
  
  getMessages: () => 
    api.get('/contact/messages'),

  // Ajoute cette fonction pour que le bouton "Lu" fonctionne
  markAsRead: (id: number) => 
    api.put(`/contact/messages/${id}/read`),

  // Ajoute cette fonction pour que le bouton "Supprimer" fonctionne
  deleteMessage: (id: number) => 
    api.delete(`/contact/messages/${id}`),

  // --- DEMANDES DE SERVICES ---
  createServiceRequest: (data: any) => 
    api.post('/contact/service-request', data),
  
  getServiceRequests: () => 
    api.get('/contact/service-requests'),
  
  updateServiceRequest: (id: number, status: string) =>
    api.put(`/contact/service-requests/${id}?status=${status}`),

  // Optionnel : Suppression d'une demande de service
  deleteServiceRequest: (id: number) => 
    api.delete(`/contact/service-requests/${id}`),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),

  getUsers: () => api.get('/admin/users'),

  // ✅ ACTIVER / DÉSACTIVER UTILISATEUR
  toggleUserStatus: (id: number) =>
    api.put(`/admin/users/${id}/toggle-status`),

  // ✅ DONNER / RETIRER ADMIN
  toggleUserAdmin: (id: number) =>
    api.put(`/admin/users/${id}/toggle-admin`),

  // ✅ SUPPRIMER UTILISATEUR
  deleteUser: (id: number) =>
    api.delete(`/admin/users/${id}`),

  getRecentActivities: () =>
    api.get('/admin/recent-activities'),
};