import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Loader } from 'lucide-react';
import { fetchCategories, fetchFeaturedProducts } from '../services/productService';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import './Home.css';

export default function Home() {
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [cats, products] = await Promise.all([
                    fetchCategories(),
                    fetchFeaturedProducts()
                ]);
                setCategories(cats);
                setFeaturedProducts(products);
            } catch (err) {
                console.error('Error loading home data:', err);
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="page home-page">
                <div className="loading-container">
                    <Loader className="spinner" size={40} />
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page home-page">
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
        <div className="page home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Pure Oils • Organic Spices • Quality Groceries
                    </h1>
                    <p className="hero-subtitle">
                        Trusted by families across India since 1995
                    </p>
                    <div className="hero-actions">
                        <Link to="/products" className="btn btn-primary">
                            <ShoppingCart size={18} />
                            Shop Now
                        </Link>
                        <Link to="/products" className="btn btn-outline">
                            Explore Products
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
                <div className="hero-image">
                    <img
                        src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=400&fit=crop"
                        alt="Indian spices and oils"
                    />
                </div>
            </section>

            {/* Categories */}
            <section className="section categories-section">
                <div className="container">
                    <h2 className="section-title">Shop by Category</h2>
                    <div className="categories-grid">
                        {categories.map(category => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section featured-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Featured Products</h2>
                        <Link to="/products" className="view-all">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="featured-scroll">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} featured />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
