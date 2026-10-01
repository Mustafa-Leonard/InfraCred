import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const client = axios.create({
    baseURL,
});

let refreshRequest: Promise<string> | null = null;

client.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const isAuthenticationRequest = ['/accounts/login/', '/accounts/register/', '/accounts/refresh/']
            .some((path) => error.config?.url?.includes(path));
        const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;

        if (error.response?.status === 401 && !isAuthenticationRequest && originalRequest && !originalRequest._retry) {
            const { refreshToken, setTokens, logout } = useAuthStore.getState();
            if (!refreshToken) {
                logout();
                return Promise.reject(error);
            }

            originalRequest._retry = true;
            try {
                if (!refreshRequest) {
                    refreshRequest = axios.post(`${baseURL}/accounts/refresh/`, { refresh: refreshToken })
                        .then(({ data }) => {
                            setTokens(data.access, data.refresh);
                            return data.access as string;
                        })
                        .finally(() => {
                            refreshRequest = null;
                        });
                }
                const accessToken = await refreshRequest;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return client(originalRequest);
            } catch (refreshError) {
                logout();
                return Promise.reject(refreshError);
            }
        }

        if (error.response?.status === 401 && !isAuthenticationRequest) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default client;
