import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3X3, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './BottomNav.css';

export default function BottomNav() {
    const location = useLocation();
    const { cartCount } = useCart();

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/products', icon: Grid3X3, label: 'Categories' },
        { path: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartCount },
        { path: '/about', icon: User, label: 'Profile' },
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map(({ path, icon: Icon, label, badge }) => (
                <Link
                    key={path}
                    to={path}
                    className={`bottom-nav-item ${location.pathname === path ? 'active' : ''}`}
                >
                    <div className="nav-icon-wrapper">
                        <Icon size={22} />
                        {badge > 0 && (
                            <span className="nav-badge">{badge > 99 ? '99+' : badge}</span>
                        )}
                    </div>
                    <span className="nav-label">{label}</span>
                </Link>
            ))}
        </nav>
    );
}
