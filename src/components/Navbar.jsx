import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon">S</div>
                    <div className="logo-text">
                        <span className="logo-name">Shobha</span>
                        <span className="logo-tagline">Enterprises</span>
                    </div>
                </Link>

                {/* Search Bar */}
                <form className="navbar-search" onSubmit={handleSearch}>
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for oils, spices, tea..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </form>

                {/* Right Actions */}
                <div className="navbar-actions">
                    <ThemeToggle />

                    <Link to="/cart" className="navbar-cart">
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
                        )}
                    </Link>

                    <Link to="/about" className="navbar-user desktop-only">
                        <User size={22} />
                    </Link>

                    <Link to="/admin" className="navbar-admin desktop-only" title="Admin Login">
                        <ShieldCheck size={22} />
                    </Link>

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="mobile-menu">
                    <form className="mobile-search" onSubmit={handleSearch}>
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </form>
                    <div className="mobile-links">
                        <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                        <Link to="/products" onClick={() => setMobileMenuOpen(false)}>Products</Link>
                        <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
                        <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                        <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="admin-link">
                            <ShieldCheck size={16} /> Admin Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
