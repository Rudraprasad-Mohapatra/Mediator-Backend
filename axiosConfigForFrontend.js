import axios from "axios";

// Create an axios instance with default settings
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // e.g., 'http://localhost:3000/api'
});

// REQUEST INTERCEPTOR
// This runs before every request is sent
api.interceptors.request.use(
    // First function: modify request config
    (config) => {
        // Try to get access token from cookie
        const accessToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1];

        // If we have a token, add it to request headers
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    // Second function: handle request errors
    (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

// RESPONSE INTERCEPTOR
// This runs after every response is received
api.interceptors.response.use(
    // First function: handle successful responses
    (response) => response,

    // Second function: handle response errors
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 (Unauthorized) and we haven't tried to refresh yet
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark that we're retrying

            try {
                // Get refresh token from cookie
                const refreshToken = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("refreshToken="))
                    ?.split("=")[1];

                // Try to get new tokens
                await axios.post("/api/auth/refresh-token", { refreshToken });

                // If successful, retry original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh failed, redirect to login
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        // For other errors, just reject the promise
        return Promise.reject(error);
    }
);

export default api;

// -----------------------------------------------------------------------------------

// Similarly using fetchClient
const BASE_URL = process.env.REACT_APP_API_URL;

// Helper to get cookies
const getCookie = (name) => {
    return document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`))
        ?.split("=")[1];
};

// Main fetch wrapper
const fetchClient = async (endpoint, options = {}) => {
    // 1. Prepare request
    const accessToken = getCookie("accessToken");

    // Merge default and custom headers
    const headers = {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
    };

    // Full request config
    const config = {
        ...options,
        headers,
    };

    try {
        // 2. Make the request
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        // 3. Handle 401 (Unauthorized) errors
        if (response.status === 401) {
            const refreshToken = getCookie("refreshToken");

            try {
                // Try to refresh tokens
                const refreshResponse = await fetch(
                    `${BASE_URL}/auth/refresh-token`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ refreshToken }),
                    }
                );

                if (!refreshResponse.ok) {
                    throw new Error("Refresh failed");
                }

                // Retry original request
                return fetchClient(endpoint, options);
            } catch (error) {
                // Redirect to login if refresh failed
                window.location.href = "/login";
                throw error;
            }
        }

        // 4. Handle other responses
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 5. Parse and return JSON response
        return await response.json();
    } catch (error) {
        console.error("Request failed:", error);
        throw error;
    }
};

// Helper methods for common HTTP methods
export const api = {
    get: (endpoint) => fetchClient(endpoint),

    post: (endpoint, data) =>
        fetchClient(endpoint, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    put: (endpoint, data) =>
        fetchClient(endpoint, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    delete: (endpoint) =>
        fetchClient(endpoint, {
            method: "DELETE",
        }),
};

// ----------------------------------------------------------------------------------

// Using axios
import api from "../services/api/axiosConfig";

const Dashboard = () => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/dashboard/user");
                console.log(response.data);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, []);
};

// Using fetch
import { api } from "../services/api/fetchClient";

const Dashboard = () => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.get("/dashboard/user");
                console.log(data);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, []);
};
