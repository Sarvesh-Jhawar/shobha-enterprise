import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import './Cart.css';

export default function Cart() {
    const { cartItems, cartTotal, cartCount } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="page cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-icon">
                            <ShoppingBag size={64} />
                        </div>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/products" className="btn btn-primary">
                            Start Shopping
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page cart-page">
            <div className="container">
                <header className="cart-header">
                    <h1>Your Cart</h1>
                    <span className="item-count">{cartCount} items</span>
                </header>

                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <CartItem key={item.cartId} item={item} />
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary">
                        <h3>Order Summary</h3>

                        <div className="summary-row">
                            <span>Subtotal ({cartCount} items)</span>
                            <span>₹{cartTotal}</span>
                        </div>

                        <div className="summary-row">
                            <span>Delivery</span>
                            <span className="free">FREE</span>
                        </div>

                        <div className="summary-total">
                            <span>Total</span>
                            <span className="total-price">₹{cartTotal}</span>
                        </div>

                        <Link to="/checkout" className="btn btn-green checkout-btn">
                            Proceed to Checkout
                            <ArrowRight size={18} />
                        </Link>

                        <Link to="/products" className="btn btn-outline continue-btn">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
