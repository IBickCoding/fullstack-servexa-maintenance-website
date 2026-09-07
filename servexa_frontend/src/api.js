import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("⚠️ Unauthorized - token may be expired");

            // Remove bad token
            localStorage.removeItem("token");

            // Optional: redirect to login
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export const requestAPI = {
    getAll: () => api.get(`${API_BASE_URL}/service-request`),
    getById: (id) => api.get(`${API_BASE_URL}/service-request/${id}`),
    getByTenantId: (tenantId) => api.get(`${API_BASE_URL}/service-request/my-requests/${tenantId}`),
    create: (data) => api.post(`${API_BASE_URL}/service-request`, data),
    update: (id, data) => api.put(`${API_BASE_URL}/service-request/${id}`, data),
    delete: (id) => api.delete(`${API_BASE_URL}/service-request/${id}`),
};

export const tenantAPI = {
    getAll: () => api.get(`${API_BASE_URL}/tenant`),
    getById: (id) => api.get(`${API_BASE_URL}/tenant/${id}`),
    create: (data) => api.post(`${API_BASE_URL}/tenant`, data),
    update: (id, data) => api.put(`${API_BASE_URL}/tenant/${id}`, data),
    delete: (id) => api.delete(`${API_BASE_URL}/tenant/${id}`),
};

export const vendorAPI = {
    getAll: () => api.get(`${API_BASE_URL}/vendor`),
    getById: (id) => api.get(`${API_BASE_URL}/vendor/${id}`),
    create: (data) => api.post(`${API_BASE_URL}/vendor`, data),
    update: (id, data) => api.put(`${API_BASE_URL}/vendor/${id}`, data),
    delete: (id) => api.delete(`${API_BASE_URL}/vendor/${id}`),
};

export const authAPI = {
    login: async (data) => {
        const response = await api.post(`/auth/login`, data);
        if (response.data && response.data.token) {
            localStorage.setItem("token", response.data.token);
        }
        return response;
    },
    register: (data) => api.post(`/auth/register`, data),
    logout: () => {
        localStorage.removeItem("token");
    },
};