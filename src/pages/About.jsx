import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import './About.css';

export default function About() {
    return (
        <div className="page about-page">
            {/* Hero */}
            <section className="about-hero">
                <div className="container">
                    <div className="hero-content">
                        <h1>Trusted Local Enterprise Since 1995</h1>
                        <p>
                            Shobha Enterprises has been a cornerstone of the community, dedicated to providing
                            every family with the finest, freshest groceries, traditional spices, and pure essentials.
                            We believe in quality, tradition, and the trust of our customers.
                        </p>
                    </div>
                </div>
            </section>

            {/* Trust Icons */}
            <section className="section trust-icons-section">
                <div className="container">
                    <div className="trust-icons-grid">
                        <div className="trust-icon-card">
                            <div className="icon-circle">
                                <Check size={28} />
                            </div>
                            <h4>Pure Products</h4>
                            <p>100% authentic with no additives or chemicals</p>
                        </div>
                        <div className="trust-icon-card">
                            <div className="icon-circle">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                </svg>
                            </div>
                            <h4>Quality Packaging</h4>
                            <p>Fresh and sealed for maximum freshness</p>
                        </div>
                        <div className="trust-icon-card">
                            <div className="icon-circle">₹</div>
                            <h4>Affordable Prices</h4>
                            <p>Best prices guaranteed without compromise</p>
                        </div>
                        <div className="trust-icon-card">
                            <div className="icon-circle">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                                    <rect x="1" y="3" width="15" height="13" rx="2" />
                                    <path d="M16 8h4l3 3v5a2 2 0 0 1-2 2h-1" />
                                    <circle cx="5.5" cy="18.5" r="2.5" />
                                    <circle cx="18.5" cy="18.5" r="2.5" />
                                </svg>
                            </div>
                            <h4>Fast Delivery</h4>
                            <p>Quick and reliable doorstep delivery</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="section story-section">
                <div className="container">
                    <div className="story-content">
                        <h2>Our Story</h2>
                        <p>
                            What started as a small family-owned grocery store in Visakhapatnam has grown into
                            a trusted name for quality Indian groceries. For nearly three decades, we've maintained
                            the same commitment to purity and authenticity that our founders believed in.
                        </p>
                        <p>
                            We source directly from farmers and trusted suppliers, ensuring that every product
                            that reaches your kitchen meets our high standards. From cold-pressed oils to
                            organic spices, we bring you the best of India's culinary heritage.
                        </p>
                    </div>
                    <div className="story-image">
                        <img
                            src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=500&h=400&fit=crop"
                            alt="Traditional Indian grocery store"
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section cta-section">
                <div className="container">
                    <h2>Ready to Experience Quality?</h2>
                    <p>Browse our collection of premium groceries and experience the Shobha difference.</p>
                    <Link to="/products" className="btn btn-primary">
                        Shop Now <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
