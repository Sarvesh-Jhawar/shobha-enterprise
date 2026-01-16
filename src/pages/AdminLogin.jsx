import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck, Store, LogIn } from 'lucide-react';
import { login } from '../services/api';
import './AdminLogin.css';

// Default tenant slug - can be configured
const DEFAULT_TENANT_SLUG = 'shobha';

export default function AdminLogin() {
    const [tenantSlug, setTenantSlug] = useState(DEFAULT_TENANT_SLUG);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Clear any stale session before new login
        sessionStorage.removeItem('isAdminLoggedIn');
        sessionStorage.removeItem('adminData');

        try {
            const response = await login(tenantSlug, username, password);

            // Store admin session info
            sessionStorage.setItem('isAdminLoggedIn', 'true');
            sessionStorage.setItem('adminData', JSON.stringify({
                adminId: response.adminId,
                username: response.username,
                tenantId: response.tenantId,
                tenantName: response.tenantName,
                tenantSlug: response.tenantSlug
            }));

            navigate('/admin/dashboard');
        } catch (err) {
            if (err.status === 401) {
                setError('Invalid username or password');
            } else if (err.status === 404) {
                setError('Tenant not found');
            } else if (err.status === 403) {
                setError('Account is inactive or forbidden');
            } else {
                setError('Login failed. Please check if the server is running.');
            }
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-container">
                <div className="admin-login-card">
                    {/* Header */}
                    <div className="admin-login-header">
                        <div className="admin-icon">
                            <ShieldCheck size={40} />
                        </div>
                        <h1>Admin Login</h1>
                        <p>Enter your credentials to manage products</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="admin-login-form">
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="tenantSlug">Tenant</label>
                            <div className="input-wrapper">
                                <Store size={18} className="input-icon" />
                                <input
                                    type="text"
                                    id="tenantSlug"
                                    value={tenantSlug}
                                    onChange={(e) => setTenantSlug(e.target.value)}
                                    placeholder="Enter tenant slug"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <div className="input-wrapper">
                                <User size={18} className="input-icon" />
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                    required
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="admin-login-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="spinner"></span>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="admin-login-footer">
                        <p>Shobha Enterprises - Admin Panel</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
