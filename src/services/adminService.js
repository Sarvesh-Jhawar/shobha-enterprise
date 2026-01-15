// Admin API Service - Connects to Spring Boot backend for product CRUD
const API_BASE_URL = 'http://localhost:8081/api/admin/products';
const TENANT_ID = 1;

// Helper function for API calls with headers
const apiRequest = async (endpoint = '', options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        'X-Tenant-ID': TENANT_ID.toString(),
        ...options.headers
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};

// Get all products
export const getAllProducts = async () => {
    return apiRequest();
};

// Create a new product
export const createProduct = async (product) => {
    return apiRequest('', {
        method: 'POST',
        body: JSON.stringify(product)
    });
};

// Update an existing product
export const updateProduct = async (id, product) => {
    return apiRequest(`/${id}`, {
        method: 'PUT',
        body: JSON.stringify(product)
    });
};
