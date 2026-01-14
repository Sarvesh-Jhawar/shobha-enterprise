import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Filter, Loader } from 'lucide-react';
import { fetchProductsByCategory, fetchCategoryById } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import './Category.css';

export default function Category() {
    const { id } = useParams();

    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [sortBy, setSortBy] = useState('featured');
    const [priceFilter, setPriceFilter] = useState('all');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [cat, prods] = await Promise.all([
                    fetchCategoryById(id),
                    fetchProductsByCategory(id)
                ]);
                setCategory(cat);
                setProducts(prods);
            } catch (err) {
                console.error('Error loading category:', err);
                setError('Failed to load category. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Price filter
        switch (priceFilter) {
            case 'under100':
                result = result.filter(p => p.price < 100);
                break;
            case '100to500':
                result = result.filter(p => p.price >= 100 && p.price <= 500);
                break;
            case 'above500':
                result = result.filter(p => p.price > 500);
                break;
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
                result.sort((a, b) => a.id - b.id);
        }

        return result;
    }, [products, sortBy, priceFilter]);

    if (loading) {
        return (
            <div className="page category-page">
                <div className="loading-container">
                    <Loader className="spinner" size={40} />
                    <p>Loading category...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page category-page">
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="btn btn-primary">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="page">
                <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <h2>Category not found</h2>
                    <Link to="/products" className="btn btn-primary" style={{ marginTop: '20px' }}>
                        Browse All Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page category-page">
            <div className="container">
                <Link to="/products" className="back-link">
                    <ArrowLeft size={18} />
                    Back to Products
                </Link>

                {/* Category Header */}
                <header className="category-header">
                    <div className="category-info">
                        <h1>{category.name}</h1>
                        <p>{category.description}</p>
                    </div>
                    <span className="product-count">{filteredProducts.length} products</span>
                </header>

                {/* Filters */}
                <div className="category-filters">
                    <div className="filter-group">
                        <Filter size={16} />
                        <select
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Prices</option>
                            <option value="under100">Under ₹100</option>
                            <option value="100to500">₹100 - ₹500</option>
                            <option value="above500">Above ₹500</option>
                        </select>
                    </div>

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

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="category-grid">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <p>No products found in this category.</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
