import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Package, Plus, Edit2, Save, X, LogOut, RefreshCw,
    AlertCircle, CheckCircle, Search, Trash2, Filter
} from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct, logout } from '../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [editingId, setEditingId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [adminData, setAdminData] = useState(null);
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const navigate = useNavigate();

    // Form state for new/edit product
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        unit: 'kg',
        active: true
    });

    // Get unique categories from products
    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
        return uniqueCategories.sort();
    }, [products]);

    // Check auth on mount
    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn');
        const storedAdminData = sessionStorage.getItem('adminData');

        if (!isLoggedIn || !storedAdminData) {
            navigate('/admin');
            return;
        }

        try {
            const parsed = JSON.parse(storedAdminData);
            setAdminData(parsed);
        } catch {
            navigate('/admin');
            return;
        }
    }, [navigate]);

    // Load products when adminData is available
    useEffect(() => {
        if (adminData?.tenantSlug) {
            loadProducts();
        }
    }, [adminData]);

    const loadProducts = async () => {
        if (!adminData?.tenantSlug) return;

        try {
            setLoading(true);
            setError('');
            const data = await getProducts(adminData.tenantSlug);
            setProducts(data);
        } catch (err) {
            if (err.status === 401) {
                setError('Session expired. Please login again.');
                setTimeout(() => handleLogout(), 2000);
            } else {
                setError('Failed to load products. Make sure the backend server is running.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        if (adminData?.tenantSlug) {
            try {
                await logout(adminData.tenantSlug);
            } catch {
                // Ignore logout errors
            }
        }
        sessionStorage.removeItem('isAdminLoggedIn');
        sessionStorage.removeItem('adminData');
        navigate('/admin');
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCategorySelect = (e) => {
        const value = e.target.value;
        if (value === '__new__') {
            setShowNewCategory(true);
            setNewCategoryName('');
        } else {
            setShowNewCategory(false);
            setFormData(prev => ({ ...prev, category: value }));
        }
    };

    const handleNewCategoryChange = (e) => {
        const value = e.target.value;
        setNewCategoryName(value);
        setFormData(prev => ({ ...prev, category: value }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            unit: 'kg',
            active: true
        });
        setEditingId(null);
        setShowAddForm(false);
        setShowNewCategory(false);
        setNewCategoryName('');
    };

    const handleEdit = (product) => {
        const categoryExists = categories.includes(product.category);
        setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            category: product.category || '',
            unit: product.unit || 'kg',
            active: product.active !== false
        });
        setEditingId(product.id);
        setShowAddForm(false);
        // If category doesn't exist in list, show new category input
        if (product.category && !categoryExists) {
            setShowNewCategory(true);
            setNewCategoryName(product.category);
        } else {
            setShowNewCategory(false);
        }
    };

    const handleAddNew = () => {
        resetForm();
        setShowAddForm(true);
    };

    const handleSave = async () => {
        if (!adminData?.tenantSlug) return;

        try {
            setError('');
            const productData = {
                ...formData,
                price: parseFloat(formData.price)
            };

            if (editingId) {
                await updateProduct(adminData.tenantSlug, editingId, productData);
                setSuccessMsg('Product updated successfully!');
            } else {
                await createProduct(adminData.tenantSlug, productData);
                setSuccessMsg('Product created successfully!');
            }

            await loadProducts();
            resetForm();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            if (err.status === 401) {
                setError('Session expired. Please login again.');
                setTimeout(() => handleLogout(), 2000);
            } else {
                setError('Failed to save product. Please try again.');
            }
            console.error(err);
        }
    };

    const handleDelete = async (productId) => {
        if (!adminData?.tenantSlug) return;

        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            setError('');
            await deleteProduct(adminData.tenantSlug, productId);
            setSuccessMsg('Product deleted successfully!');
            await loadProducts();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            if (err.status === 401) {
                setError('Session expired. Please login again.');
                setTimeout(() => handleLogout(), 2000);
            } else {
                setError('Failed to delete product. Please try again.');
            }
            console.error(err);
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="loading-container">
                    <RefreshCw size={48} className="spinner" />
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <header className="admin-header">
                <div className="admin-header-left">
                    <Package size={28} />
                    <div>
                        <h1>Product Management</h1>
                        {adminData && (
                            <p className="admin-tenant-info">
                                {adminData.tenantName} • {adminData.username}
                            </p>
                        )}
                    </div>
                </div>
                <div className="admin-header-right">
                    <button className="btn-icon" onClick={loadProducts} title="Refresh">
                        <RefreshCw size={20} />
                    </button>
                    <button className="btn-logout" onClick={handleLogout}>
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </header>

            {/* Messages */}
            {error && (
                <div className="message error-msg">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}
            {successMsg && (
                <div className="message success-msg">
                    <CheckCircle size={20} />
                    {successMsg}
                </div>
            )}

            {/* Actions Bar */}
            <div className="admin-actions">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-box">
                    <Filter size={18} />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <button className="btn-add" onClick={handleAddNew}>
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            {/* Add/Edit Form */}
            {(showAddForm || editingId) && (
                <div className="product-form-container">
                    <div className="product-form">
                        <div className="form-header">
                            <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                            <button className="btn-close" onClick={resetForm}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Category *</label>
                                {!showNewCategory ? (
                                    <select
                                        value={formData.category}
                                        onChange={handleCategorySelect}
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                        <option value="__new__">+ Add New Category</option>
                                    </select>
                                ) : (
                                    <div className="new-category-input">
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={handleNewCategoryChange}
                                            placeholder="Enter new category name"
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            className="btn-cancel-new"
                                            onClick={() => {
                                                setShowNewCategory(false);
                                                setFormData(prev => ({ ...prev, category: '' }));
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Price (₹) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Unit</label>
                                <select name="unit" value={formData.unit} onChange={handleInputChange}>
                                    <option value="kg">kg</option>
                                    <option value="g">g</option>
                                    <option value="L">L</option>
                                    <option value="ml">ml</option>
                                    <option value="piece">piece</option>
                                    <option value="pack">pack</option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Product description..."
                                    rows="3"
                                />
                            </div>

                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="active"
                                        checked={formData.active}
                                        onChange={handleInputChange}
                                    />
                                    Active
                                </label>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button className="btn-cancel" onClick={resetForm}>
                                Cancel
                            </button>
                            <button className="btn-save" onClick={handleSave}>
                                <Save size={18} />
                                {editingId ? 'Update Product' : 'Create Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Products Table */}
            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Unit</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="no-data">
                                    No products found
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map(product => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>
                                        <div className="product-name">{product.name}</div>
                                        <div className="product-desc">{product.description?.slice(0, 50)}...</div>
                                    </td>
                                    <td>
                                        <span className="category-badge">{product.category}</span>
                                    </td>
                                    <td>
                                        <span className="current-price">₹{product.price}</span>
                                    </td>
                                    <td>{product.unit}</td>
                                    <td>
                                        <span className={`status-badge ${product.active ? 'active' : 'inactive'}`}>
                                            {product.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-edit"
                                                onClick={() => handleEdit(product)}
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(product.id)}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Stats Footer */}
            <div className="admin-footer">
                <p>Total Products: {products.length}</p>
                <p>Active: {products.filter(p => p.active).length}</p>
                <p>Showing: {filteredProducts.length}</p>
            </div>
        </div>
    );
}
