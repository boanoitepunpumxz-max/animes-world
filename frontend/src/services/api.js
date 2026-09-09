import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  withCredentials: true,
  timeout: 15000,
});

// Injeta token em toda requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aw_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Trata respostas de erro globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error;

    if (status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED') {
      localStorage.removeItem('aw_token');
      localStorage.removeItem('aw_user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (status === 429) {
      toast.error(message || 'Muitas tentativas. Aguarde um momento.');
    }

    if (status >= 500) {
      toast.error('Erro no servidor. Tente novamente.');
    }

    return Promise.reject(error);
  }
);

export default api;

// ─── Auth ─────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

// ─── Anime ────────────────────────────────────────────────────
export const animeAPI = {
  getAll: (params) => api.get('/anime', { params }),
  getBySlug: (slug) => api.get(`/anime/${slug}`),
  getFeatured: () => api.get('/anime/featured'),
  getPopular: (limit) => api.get('/anime/popular', { params: { limit } }),
  getRecentEpisodes: (limit) => api.get('/anime/recent-episodes', { params: { limit } }),
  getBySeason: (year, season) => api.get(`/anime/season/${year}/${season}`),
};

// ─── Episodes ─────────────────────────────────────────────────
export const episodesAPI = {
  getBySeason: (animeId, season) => api.get(`/episodes/${animeId}/season/${season}`),
  getAll: (animeId) => api.get(`/episodes/${animeId}/all`),
  getDetail: (episodeId) => api.get(`/episodes/detail/${episodeId}`),
  saveProgress: (episodeId, data) => api.post(`/episodes/${episodeId}/progress`, data),
};

// ─── Genres ───────────────────────────────────────────────────
export const genresAPI = {
  getAll: () => api.get('/genres'),
  getBySlug: (slug, params) => api.get(`/genres/${slug}`, { params }),
};

// ─── Search ───────────────────────────────────────────────────
export const searchAPI = {
  search: (q, params) => api.get('/search', { params: { q, ...params } }),
  suggestions: (q) => api.get('/search/suggestions', { params: { q } }),
};

// ─── User ─────────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.patch('/user/profile', data),
  changePassword: (data) => api.patch('/user/password', data),
  getHistory: (params) => api.get('/user/history', { params }),
  clearHistory: () => api.delete('/user/history'),
  getContinueWatching: (limit) => api.get('/user/continue-watching', { params: { limit } }),
  getFavorites: () => api.get('/user/favorites'),
  toggleFavorite: (animeId) => api.post(`/user/favorites/${animeId}`),
  getWatchlist: (params) => api.get('/user/watchlist', { params }),
  updateWatchlist: (animeId, status) => api.post(`/user/watchlist/${animeId}`, { status }),
  removeFromWatchlist: (animeId) => api.delete(`/user/watchlist/${animeId}`),
  getSettings: () => api.get('/user/settings'),
  updateSettings: (data) => api.put('/user/settings', data),
};

// ─── Notifications ────────────────────────────────────────────
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

// ─── Support ──────────────────────────────────────────────────
export const supportAPI = {
  createTicket: (data) => api.post('/support', data),
  getMyTickets: () => api.get('/support/my-tickets'),
};

// ─── Admin ────────────────────────────────────────────────────
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),
  getSecurityLogs: (params) => api.get('/admin/security/logs', { params }),
  getLoginAttempts: (params) => api.get('/admin/security/login-attempts', { params }),
  getAnimes: (params) => api.get('/admin/anime', { params }),
  updateAnime: (id, data) => api.patch(`/admin/anime/${id}`, data),
  deleteAnime: (id) => api.delete(`/admin/anime/${id}`),
  getEpisodes: (params) => api.get('/admin/episodes', { params }),
  createEpisode: (data) => api.post('/admin/episodes', data),
  updateEpisode: (id, data) => api.patch(`/admin/episodes/${id}`, data),
  getSources: (episodeId) => api.get(`/admin/episodes/${episodeId}/sources`),
  createSource: (episodeId, data) => api.post(`/admin/episodes/${episodeId}/sources`, data),
  deleteSource: (episodeId, sourceId) => api.delete(`/admin/episodes/${episodeId}/sources/${sourceId}`),
  getTickets: (params) => api.get('/admin/tickets', { params }),
  replyTicket: (id, data) => api.patch(`/admin/tickets/${id}`, data),
  getSyncLogs: () => api.get('/admin/sync/logs'),
  triggerSync: () => api.post('/admin/sync/trigger'),
};
