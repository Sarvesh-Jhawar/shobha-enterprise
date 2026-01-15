import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatName } from '../utils/formatters';
import './CartItem.css';

export default function CartItem({ item }) {
    const { updateQuantity, removeFromCart } = useCart();
    const { cartId, name, image, variant, quantity } = item;

    // Get price based on variant if exists
    const price = variant ? variant.price : item.price;

    const subtotal = price * quantity;

    return (
        <div className="cart-item">
            <img src={image} alt={formatName(name)} className="cart-item-image" />

            <div className="cart-item-details">
                <div className="cart-item-header">
                    <div>
                        <h4 className="cart-item-name">{formatName(name)}</h4>
                        {variant && <span className="cart-item-variant">{variant}</span>}
                    </div>
                    <button
                        className="cart-item-remove"
                        onClick={() => removeFromCart(cartId)}
                        aria-label="Remove item"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="cart-item-footer">
                    <span className="cart-item-price">₹{price}</span>

                    <div className="qty-selector">
                        <button
                            className="qty-btn"
                            onClick={() => updateQuantity(cartId, quantity - 1)}
                            aria-label="Decrease quantity"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="qty-value">{quantity}</span>
                        <button
                            className="qty-btn"
                            onClick={() => updateQuantity(cartId, quantity + 1)}
                            aria-label="Increase quantity"
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    <span className="cart-item-subtotal">₹{subtotal}</span>
                </div>
            </div>
        </div>
    );
}
