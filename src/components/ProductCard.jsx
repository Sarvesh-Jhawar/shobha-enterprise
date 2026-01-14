import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';
import './ProductCard.css';

export default function ProductCard({ product, featured = false }) {
    const { addToCart } = useCart();
    const { showToast } = useToast();

    // Support both old static data fields and new database fields
    const {
        id,
        name,
        price,
        image,
        image_name,
        category,
        unit
    } = product;

    // Use image_name from DB or fall back to image from static data
    const productImage = image_name || image || 'https://via.placeholder.com/400';

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1, unit || product.variants?.[0]?.size || null);
        showToast('Added to cart!');
    };

    return (
        <Link to={`/product/${id}`} className={`product-card ${featured ? 'featured' : ''}`}>
            <div className="product-image-wrapper">
                <img src={productImage} alt={name} className="product-image" loading="lazy" />
            </div>

            <div className="product-info">
                <span className="product-category">{category}</span>
                <h3 className="product-name">{name}</h3>

                <div className="product-price-row">
                    <div className="price-wrapper">
                        <span className="price">₹{price}</span>
                        {unit && <span className="price-unit">/ {unit}</span>}
                    </div>

                    <button className="add-btn" onClick={handleAddToCart} aria-label="Add to cart">
                        <Plus size={18} />
                    </button>
                </div>
            </div>
        </Link>
    );
}
