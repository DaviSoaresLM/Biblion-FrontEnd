import axios from "axios";
import authStore from "../utils/authStore";

const BASE = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL
    : 'http://localhost:8081';

const api = axios.create({
    baseURL: BASE
});

// Injetar token das credenciais de sessão (sessionStorage) em todas as requisições
api.interceptors.request.use((cfg) => {
    try {
        const token = authStore.getToken();
        if (token) {
            cfg.headers = cfg.headers || {};
            cfg.headers.Authorization = `Bearer ${token}`;
        }
    } catch (e) {
        // ignore
    }
    return cfg;
}, (err) => Promise.reject(err));

export default api;