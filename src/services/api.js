// API Service - Connects to Spring Boot backend for authentication and product CRUD
const API_BASE = 'http://localhost:8082/api';

// Helper for all requests with credentials (cookies)
const fetchWithAuth = async (url, options = {}) => {
    const response = await fetch(url, {
        ...options,
        credentials: 'include', // IMPORTANT: Send cookies with requests
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = new Error('API Error');
        error.status = response.status;
        try {
            error.message = await response.text();
        } catch {
            error.message = `HTTP error! status: ${response.status}`;
        }
        throw error;
    }

    return response.json();
};

// ============ AUTH ============
export const login = async (tenantSlug, username, password) => {
    return fetchWithAuth(`${API_BASE}/${tenantSlug}/admins/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
};

export const logout = async (tenantSlug) => {
    return fetch(`${API_BASE}/${tenantSlug}/admins/logout`, {
        method: 'POST',
        credentials: 'include',
    });
};

// ============ PRODUCTS ============
export const getProducts = async (tenantSlug) => {
    return fetchWithAuth(`${API_BASE}/${tenantSlug}/products`);
};

export const getProduct = async (tenantSlug, productId) => {
    return fetchWithAuth(`${API_BASE}/${tenantSlug}/products/${productId}`);
};

export const createProduct = async (tenantSlug, product) => {
    return fetchWithAuth(`${API_BASE}/${tenantSlug}/products`, {
        method: 'POST',
        body: JSON.stringify(product),
    });
};

export const updateProduct = async (tenantSlug, productId, product) => {
    return fetchWithAuth(`${API_BASE}/${tenantSlug}/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(product),
    });
};

export const deleteProduct = async (tenantSlug, productId) => {
    return fetchWithAuth(`${API_BASE}/${tenantSlug}/products/${productId}`, {
        method: 'DELETE',
    });
};
