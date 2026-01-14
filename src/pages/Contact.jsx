import { useState } from 'react';
import { MapPin, Phone, Clock, Send, Check, Mail } from 'lucide-react';
import Footer from '../components/Footer';
import './Contact.css';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', mobile: '', message: '' });
        }, 3000);
    };

    return (
        <div className="page contact-page">
            <div className="container">
                <header className="contact-header">
                    <h1>Contact Us</h1>
                    <p>We'd love to hear from you. Get in touch with us!</p>
                </header>

                <div className="contact-layout">
                    {/* Contact Info */}
                    <div className="contact-info">
                        {/* Map */}
                        <div className="map-container">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3820.123456789!2d78.1234567!3d16.7654321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sJadcherla%2C%20Mahabubnagar%2C%20Telangana!5e0!3m2!1sen!2sin!4v1699000000000!5m2!1sen!2sin"
                                width="100%"
                                height="200"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Shobha Enterprises Location"
                            />
                        </div>

                        <div className="info-cards">
                            <div className="info-card">
                                <div className="info-icon">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h4>Location</h4>
                                    <p>Near Union Bank of India, Gunj, Jadcherla-509301</p>
                                    <p>Dist: Mahabubnagar, Telangana</p>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h4>Phone</h4>
                                    <a href="tel:+919849052081">+91 98490 52081 - Bhagwan das Jhawar</a>
                                    <br />
                                    <a href="tel:+917013506979">+91 70135 06979 - Bharath Jhawar</a>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h4>Email</h4>
                                    <a href="mailto:bharathjhawar@gmail.com">bharathjhawar@gmail.com</a>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h4>Business Hours</h4>
                                    <p>7:00 AM - 10:00 PM (All Days)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-wrapper">
                        <h3>Send Us a Message</h3>

                        {submitted ? (
                            <div className="form-success">
                                <div className="success-icon">
                                    <Check size={32} />
                                </div>
                                <h4>Message Sent!</h4>
                                <p>We'll get back to you soon.</p>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
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

                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Write your message here..."
                                        className="input textarea"
                                        rows={4}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary submit-btn">
                                    <Send size={18} />
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
