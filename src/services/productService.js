import { supabase } from '../lib/supabase';

// Category icons mapping (add more as needed)
const categoryIcons = {
    oils: 'Droplets',
    spices: 'Leaf',
    tea: 'Coffee',
    grains: 'Wheat',
    biscuits: 'Cookie',
    ghee: 'Droplets',
    home: 'Home'
};

// Category images mapping (add more as needed)
const categoryImages = {
    oils: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop',
    spices: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop',
    tea: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=300&fit=crop',
    grains: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop',
    biscuits: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=300&fit=crop',
    ghee: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=300&fit=crop',
    home: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop'
};

// Fetch all active products from Supabase
export const fetchProducts = async () => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('id');

    if (error) {
        console.error('Error fetching products:', error);
        throw error;
    }

    return data;
};

// Fetch unique categories dynamically from products
export const fetchCategories = async () => {
    const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('active', true);

    if (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }

    // Get unique categories and build category objects
    const uniqueCategories = [...new Set(data.map(p => p.category))];

    return uniqueCategories.map(cat => ({
        id: cat,
        name: cat.charAt(0).toUpperCase() + cat.slice(1), // Capitalize first letter
        icon: categoryIcons[cat] || 'Package',
        image: categoryImages[cat] || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop',
        description: `Quality ${cat} products`
    }));
};

// Get category by ID
export const fetchCategoryById = async (categoryId) => {
    const categories = await fetchCategories();
    return categories.find(c => c.id === categoryId);
};

// Fetch products by category
export const fetchProductsByCategory = async (category) => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .eq('category', category)
        .order('id');

    if (error) {
        console.error('Error fetching products by category:', error);
        throw error;
    }

    return data;
};

// Fetch a single product by ID
export const fetchProductById = async (id) => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        throw error;
    }

    return data;
};

// Fetch featured products (first 6 products as featured)
export const fetchFeaturedProducts = async () => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('id')
        .limit(6);

    if (error) {
        console.error('Error fetching featured products:', error);
        throw error;
    }

    return data;
};

// Search products by name or description
export const searchProducts = async (query) => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .order('id');

    if (error) {
        console.error('Error searching products:', error);
        throw error;
    }

    return data;
};
