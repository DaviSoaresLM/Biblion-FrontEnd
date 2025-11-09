import axios from "axios";

const BASE = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL
    : 'http://localhost:8080';

const api = axios.create({
    baseURL: BASE
});

// Interceptors (placeholder): JWT token injection can be added here later.
// Ex: api.interceptors.request.use(cfg => { cfg.headers.Authorization = `Bearer ${token}`; return cfg; });

export default api;