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


            {/* Story */}
            <section className="section story-section">
                <div className="container">
                    <div className="story-content">
                        <h2>Our Story</h2>
                        <p>
                            What started as a small family-owned grocery store in Jadcherla has grown into
                            a trusted name for quality Indian groceries. For nearly three decades, we've maintained
                            the same commitment to purity and authenticity that our founders believed in.
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
