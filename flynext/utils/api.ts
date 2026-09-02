import axios from "axios";
import { useRouter } from 'next/router';

// Create Axios instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "/api", // Backend URL
    withCredentials: true, // Ensure cookies are sent for refresh token
});

// Request Interceptor: Attach access token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle token expiration & refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Refresh the token
                const refreshRes = await axios.post("/api/auth/refresh", 
                    {}, { withCredentials: true });

                if (refreshRes.status === 200) {
                    const newToken = refreshRes.data.accessToken;
                    localStorage.setItem("accessToken", newToken);

                    // Retry the original request with new token
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("Refresh token expired, redirecting to login...");
                localStorage.removeItem("accessToken");

                const router = useRouter();
                router.push('/login');
            }
        }

        return Promise.reject(error);
    }
);

export default api;
