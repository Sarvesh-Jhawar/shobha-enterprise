import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader } from 'lucide-react';
import { fetchProducts, fetchCategories, searchProducts as searchProductsAPI } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import './Products.css';

export default function Products() {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [localSearch, setLocalSearch] = useState(searchQuery);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [prods, cats] = await Promise.all([
                    searchQuery ? searchProductsAPI(searchQuery) : fetchProducts(),
                    fetchCategories()
                ]);
                setProducts(prods);
                setCategories(cats);
            } catch (err) {
                console.error('Error loading products:', err);
                setError('Failed to load products. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [searchQuery]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Filter by category
        if (selectedCategory !== 'all') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Filter by local search
        if (localSearch && !searchQuery) {
            const q = localSearch.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                (p.description && p.description.toLowerCase().includes(q))
            );
        }

        // Sort
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Default sort by id
                result.sort((a, b) => a.id - b.id);
        }

        return result;
    }, [products, selectedCategory, sortBy, localSearch, searchQuery]);

    if (loading) {
        return (
            <div className="page products-page">
                <div className="loading-container">
                    <Loader className="spinner" size={40} />
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page products-page">
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="btn btn-primary">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page products-page">
            <div className="container">
                <header className="products-header">
                    <h1>{searchQuery ? `Results for "${searchQuery}"` : 'All Products'}</h1>
                    <p>{filteredProducts.length} products found</p>
                </header>

                {/* Filters */}
                <div className="filters-bar">
                    <div className="search-filter">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-selects">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                        >
                            <option value="featured">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name</option>
                        </select>
                    </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="products-grid">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <p>No products found. Try adjusting your filters.</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
