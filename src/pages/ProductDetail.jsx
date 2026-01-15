import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Check, ArrowLeft, Loader } from 'lucide-react';
import { fetchProductById, fetchProductsByCategory } from '../services/productService';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { formatName } from '../utils/formatters';
import './ProductDetail.css';

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                const prod = await fetchProductById(id);
                setProduct(prod);

                // Set initial variant if variants exist
                if (prod?.product_variants && prod.product_variants.length > 0) {
                    setSelectedVariant(prod.product_variants[0]);
                } else if (prod?.unit) {
                    setSelectedVariant({
                        quantity_value: '',
                        quantity_unit: prod.unit,
                        price: prod.price
                    });
                }

                // Fetch related products
                if (prod?.category) {
                    const related = await fetchProductsByCategory(prod.category);
                    setRelatedProducts(related.filter(p => p.id !== prod.id).slice(0, 4));
                }
            } catch (err) {
                console.error('Error loading product:', err);
                setError('Failed to load product. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedVariant);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) {
        return (
            <div className="page product-detail-page">
                <div className="loading-container">
                    <Loader className="spinner" size={40} />
                    <p>Loading product...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page product-detail-page">
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="btn btn-primary">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="page">
                <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <h2>Product not found</h2>
                    <Link to="/products" className="btn btn-primary" style={{ marginTop: '20px' }}>
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page product-detail-page">
            <div className="container">
                <Link to="/products" className="back-link">
                    <ArrowLeft size={18} />
                    Back to Products
                </Link>

                <div className="product-detail">
                    {/* Product Image */}
                    <div className="product-image-section">
                        <img
                            src={product.image_name || 'https://via.placeholder.com/400'}
                            alt={formatName(product.name)}
                            className="main-image"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="product-info-section">
                        <span className="product-category">{product.category}</span>
                        <h1 className="product-title">{formatName(product.name)}</h1>

                        <div className="product-price">
                            <span className="price">₹{selectedVariant?.price || product.price}</span>
                            {selectedVariant && (
                                <span className="variant-label">
                                    / {selectedVariant.quantity_value} {selectedVariant.quantity_unit}
                                </span>
                            )}
                        </div>

                        <p className="product-description">{product.description}</p>

                        {/* Variants Section */}
                        {product.product_variants && product.product_variants.length > 0 && (
                            <div className="variants-section">
                                <h4>Available Sizes</h4>
                                <div className="variant-options">
                                    {product.product_variants.map((v, index) => (
                                        <button
                                            key={v.id || index}
                                            className={`variant-btn ${selectedVariant?.id === v.id ? 'active' : ''}`}
                                            onClick={() => setSelectedVariant(v)}
                                        >
                                            {v.quantity_value} {v.quantity_unit}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Fallback for single unit if no variants */}
                        {!product.product_variants?.length && product.unit && (
                            <div className="variants-section">
                                <h4>Unit</h4>
                                <div className="variant-options">
                                    <button className="variant-btn active">
                                        {product.unit}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Quantity & Add to Cart */}
                        <div className="add-to-cart-section">
                            <div className="qty-selector">
                                <button
                                    className="qty-btn"
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="qty-value">{quantity}</span>
                                <button
                                    className="qty-btn"
                                    onClick={() => setQuantity(q => q + 1)}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <button
                                className={`btn btn-primary add-cart-btn ${added ? 'added' : ''}`}
                                onClick={handleAddToCart}
                            >
                                {added ? (
                                    <>
                                        <Check size={18} />
                                        Added to Cart
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={18} />
                                        Add to Cart
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="related-section">
                        <h2>Related Products</h2>
                        <div className="related-grid">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <Footer />
        </div>
    );
}
