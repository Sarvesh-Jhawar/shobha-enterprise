import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Checkout.css';

export default function Checkout() {
    const { cartItems, cartTotal, taxAmount, grandTotal, clearCart, cartCount } = useCart();

    const [formData, setFormData] = useState({
        name: '',
        mobile: ''
    });

    const [orderPlaced, setOrderPlaced] = useState(false);

    // WhatsApp business number
    const WHATSAPP_NUMBER = '919347953935';

    if (cartItems.length === 0 && !orderPlaced) {
        return (
            <div className="page checkout-page">
                <div className="container">
                    <div className="empty-checkout">
                        <h2>No items to checkout</h2>
                        <p>Add some products to your cart first.</p>
                        <Link to="/products" className="btn btn-primary">
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (orderPlaced) {
        return (
            <div className="page checkout-page">
                <div className="container">
                    <div className="order-success">
                        <div className="success-icon">
                            <Check size={48} />
                        </div>
                        <h2>Order Sent Successfully!</h2>
                        <p>Thank you for shopping with Shobha Enterprises.</p>
                        <p className="order-note">Your order has been sent via WhatsApp. We'll contact you shortly!</p>
                        <Link to="/" className="btn btn-primary">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const generateBillMessage = () => {
        const currentDate = new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let message = `🧾 *SHOBHA ENTERPRISES*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━\n`;
        message += `📋 *ORDER BILL*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

        message += `👤 *Customer Details*\n`;
        message += `Name: ${formData.name}\n`;
        message += `Phone: +91 ${formData.mobile}\n`;
        message += `Date: ${currentDate}\n\n`;

        message += `━━━━━━━━━━━━━━━━━━━━\n`;
        message += `🛒 *ORDER ITEMS*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

        cartItems.forEach((item, index) => {
            const itemPrice = item.variant
                ? (item.variants?.find(v => v.size === item.variant)?.price || item.price)
                : item.price;
            const itemTotal = itemPrice * item.quantity;

            message += `${index + 1}. *${item.name}*\n`;
            if (item.variant) {
                message += `   Size: ${item.variant}\n`;
            }
            message += `   Qty: ${item.quantity} × ₹${itemPrice}\n`;
            message += `   Subtotal: ₹${itemTotal}\n\n`;
        });

        message += `━━━━━━━━━━━━━━━━━━━━\n`;
        message += `💰 *BILL SUMMARY*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━\n`;
        message += `Items (${cartCount}): ₹${cartTotal}\n`;
        message += `Tax (GST 5%): ₹${taxAmount}\n`;
        message += `Delivery: FREE\n`;
        message += `━━━━━━━━━━━━━━━━━━━━\n`;
        message += `*GRAND TOTAL: ₹${grandTotal}*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

        message += `Thank you for your order! 🙏`;

        return message;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Generate bill message
        const billMessage = generateBillMessage();

        // Encode message for URL
        const encodedMessage = encodeURIComponent(billMessage);

        // Create WhatsApp URL
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');

        // Clear cart and show success
        clearCart();
        setOrderPlaced(true);
    };

    const isFormValid = formData.name && formData.mobile && formData.mobile.length === 10;

    return (
        <div className="page checkout-page">
            <div className="container">
                <Link to="/cart" className="back-link">
                    <ArrowLeft size={18} />
                    Back to Cart
                </Link>

                <h1 className="checkout-title">Checkout</h1>

                <div className="checkout-layout">
                    {/* Customer Form */}
                    <form className="checkout-form" onSubmit={handleSubmit}>
                        <h3>Customer Details</h3>

                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="mobile">Mobile Number</label>
                            <div className="mobile-input">
                                <span className="prefix">+91</span>
                                <input
                                    type="tel"
                                    id="mobile"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    placeholder="Enter mobile number"
                                    className="input"
                                    pattern="[0-9]{10}"
                                    maxLength={10}
                                    required
                                />
                            </div>
                        </div>
                    </form>

                    {/* Order Summary */}
                    <div className="checkout-summary">
                        <h3>Order Summary</h3>

                        <div className="summary-items">
                            {cartItems.map(item => (
                                <div key={item.cartId} className="summary-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="item-details">
                                        <span className="item-name">{item.name}</span>
                                        {item.variant && <span className="item-variant">{item.variant}</span>}
                                        <span className="item-qty">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="item-price">
                                        ₹{(item.variant
                                            ? (item.variants?.find(v => v.size === item.variant)?.price || item.price)
                                            : item.price) * item.quantity}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="summary-totals">
                            <div className="summary-row">
                                <span>{cartCount} Items</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax (GST 5%)</span>
                                <span>₹{taxAmount}</span>
                            </div>
                            <div className="summary-row">
                                <span>Delivery</span>
                                <span className="free">FREE</span>
                            </div>
                            <div className="summary-total">
                                <span>Total</span>
                                <span>₹{grandTotal}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-whatsapp place-order-btn"
                            disabled={!isFormValid}
                            onClick={handleSubmit}
                        >
                            <MessageCircle size={18} />
                            Order via WhatsApp ₹{grandTotal}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
