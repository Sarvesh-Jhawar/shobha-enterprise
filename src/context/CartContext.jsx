import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('shobha-cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('shobha-cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1, variant = null) => {
        setCartItems(prev => {
            const existingIndex = prev.findIndex(
                item => item.id === product.id && item.variant === variant
            );

            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            }

            return [...prev, {
                ...product,
                quantity,
                variant,
                cartId: `${product.id}-${variant || 'default'}-${Date.now()}`
            }];
        });
    };

    const removeFromCart = (cartId) => {
        setCartItems(prev => prev.filter(item => item.cartId !== cartId));
    };

    const updateQuantity = (cartId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(cartId);
            return;
        }
        setCartItems(prev =>
            prev.map(item =>
                item.cartId === cartId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const cartTotal = cartItems.reduce((sum, item) => {
        const price = item.variant ?
            (item.variants?.find(v => v.size === item.variant)?.price || item.price) :
            item.price;
        return sum + (price * item.quantity);
    }, 0);

    const taxAmount = Math.round(cartTotal * 0.05); // 5% GST
    const grandTotal = cartTotal + taxAmount;

    return (
        <CartContext.Provider value={{
            cartItems,
            cartCount,
            cartTotal,
            taxAmount,
            grandTotal,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
