// API Service - Connects to Spring Boot backend for authentication and product CRUD
const API_BASE = import.meta.env.VITE_API_URL || 'https://enterprises-backend-production.up.railway.app/api';

// Helper for all requests with credentials (cookies)
const fetchWithAuth = async (url, options = {}) => {
    const response = await fetch(url, {
        ...options,
        credentials: 'include', // Required for Spring Security session cookies
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = new Error('API Error');
        error.status = response.status;
        try {
            const errorData = await response.json();
            error.message = errorData.message || 'Access Denied';
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
    return fetchWithAuth(`${API_BASE}/${tenantSlug}/admins/logout`, {
        method: 'POST',
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

// ============ VARIANTS ============
export const getVariants = async (tenantSlug, productId) => {
    return fetchWithAuth(`${API_BASE}/${tenantSlug}/products/${productId}/variants`);
};

export const createVariant = async (tenantSlug, productId, variant) => {
    return fetchWithAuth(`${API_BASE}/${tenantSlug}/products/${productId}/variants`, {
        method: 'POST',
        body: JSON.stringify(variant),
    });
};

export const updateVariant = async (tenantSlug, variantId, variant) => {
    return fetchWithAuth(`${API_BASE}/${tenantSlug}/variants/${variantId}`, {
        method: 'PUT',
        body: JSON.stringify(variant),
    });
};

export const deleteVariant = async (tenantSlug, variantId) => {
    return fetchWithAuth(`${API_BASE}/${tenantSlug}/variants/${variantId}`, {
        method: 'DELETE',
    });
};
