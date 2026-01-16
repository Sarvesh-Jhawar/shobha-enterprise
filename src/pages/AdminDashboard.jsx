import { useState, useEffect, useMemo, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Package, Plus, Edit2, Save, X, LogOut, RefreshCw,
    AlertCircle, CheckCircle, Search, Trash2, Filter
} from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct, logout, getVariants, createVariant, updateVariant, deleteVariant } from '../services/api';
import { Layers, Pencil, Trash } from 'lucide-react';
import { formatName } from '../utils/formatters';
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
    const [variants, setVariants] = useState([]);
    const [showVariantsId, setShowVariantsId] = useState(null); // ID of product whose variants are being managed
    const [variantFormData, setVariantFormData] = useState({
        quantityValue: '',
        quantityUnit: 'Kg',
        price: '',
        active: true
    });
    const [editingVariantId, setEditingVariantId] = useState(null);
    const [variantLoading, setVariantLoading] = useState(false);
    const [expandedRowId, setExpandedRowId] = useState(null); // New state for row-click behavior
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
        const checkAuth = async () => {
            const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn');
            const storedAdminData = sessionStorage.getItem('adminData');

            if (!isLoggedIn || !storedAdminData) {
                navigate('/admin');
                return;
            }

            try {
                const parsed = JSON.parse(storedAdminData);
                setAdminData(parsed);

                // Verify session with backend
                if (parsed?.tenantSlug) {
                    setLoading(true);
                    await validateSession(parsed.tenantSlug);
                    // If successful, proceed to load products
                    await loadProducts(parsed.tenantSlug);
                }
            } catch (err) {
                console.error('Session validation failed:', err);
                if (err.status === 401) {
                    setError('Session expired or blocked. Please log in again.');
                } else {
                    setError('Unable to verify login session. Please check your connection.');
                }
                setTimeout(() => handleLogout(), 3000);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    const loadProducts = async (slug = adminData?.tenantSlug) => {
        const tenantSlug = slug;
        if (!tenantSlug) return;

        try {
            setLoading(true);
            setError('');
            const data = await getProducts(tenantSlug);
            setProducts(data);
        } catch (err) {
            handleApiError(err, 'Failed to load products.');
        } finally {
            setLoading(false);
        }
    };

    const handleApiError = (err, defaultMsg) => {
        console.error(err);
        if (err.status === 401) {
            setError('Session expired or unauthorized. If you just logged in, please ensure your browser allows cross-site cookies.');
            setTimeout(() => handleLogout(), 3000);
        } else if (err.status === 500) {
            setError('Server error (500). Please check backend logs.');
        } else {
            setError(err.message || defaultMsg);
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
            name: formatName(product.name) || '',
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
            handleApiError(err, 'Failed to save product. Please try again.');
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
            handleApiError(err, 'Failed to delete product. Please try again.');
        }
    };

    // Variant Handlers
    const handleManageVariants = async (productId) => {
        if (showVariantsId === productId) {
            setShowVariantsId(null);
            setVariants([]);
            return;
        }

        setShowVariantsId(productId);
        await loadVariants(productId);
    };

    const loadVariants = async (productId) => {
        if (!adminData?.tenantSlug) return;
        try {
            setVariantLoading(true);
            const data = await getVariants(adminData.tenantSlug, productId);
            setVariants(data);
        } catch (err) {
            handleApiError(err, 'Failed to load variants.');
        } finally {
            setVariantLoading(false);
        }
    };

    const handleVariantChange = (e) => {
        const { name, value, type, checked } = e.target;
        setVariantFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveVariant = async (e) => {
        e.preventDefault();
        if (!adminData?.tenantSlug || !showVariantsId) return;

        try {
            setVariantLoading(true);
            const variantData = {
                ...variantFormData,
                quantityValue: parseFloat(variantFormData.quantityValue),
                price: parseFloat(variantFormData.price)
            };

            if (editingVariantId) {
                await updateVariant(adminData.tenantSlug, editingVariantId, variantData);
                setSuccessMsg('Variant updated!');
            } else {
                await createVariant(adminData.tenantSlug, showVariantsId, variantData);
                setSuccessMsg('Variant added!');
            }

            await loadVariants(showVariantsId);
            resetVariantForm();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            handleApiError(err, 'Failed to save variant.');
        } finally {
            setVariantLoading(false);
        }
    };

    const resetVariantForm = () => {
        setVariantFormData({
            quantityValue: '',
            quantityUnit: 'Kg',
            price: '',
            active: true
        });
        setEditingVariantId(null);
    };

    const handleEditVariant = (variant) => {
        setVariantFormData({
            quantityValue: variant.quantityValue,
            quantityUnit: variant.quantityUnit,
            price: variant.price,
            active: variant.active
        });
        setEditingVariantId(variant.id);
    };

    const handleDeleteVariant = async (variantId) => {
        if (!adminData?.tenantSlug || !window.confirm('Delete this variant?')) return;

        try {
            setVariantLoading(true);
            await deleteVariant(adminData.tenantSlug, variantId);
            setSuccessMsg('Variant deleted!');
            await loadVariants(showVariantsId);
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            handleApiError(err, 'Failed to delete variant.');
        } finally {
            setVariantLoading(false);
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
                            <option key={cat} value={cat}>{formatName(cat)}</option>
                        ))}
                    </select>
                </div>
                <button className="btn-add" onClick={handleAddNew}>
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            {/* Add/Edit Form Modal */}
            {(showAddForm || editingId) && (
                <div className="modal-overlay" onClick={resetForm}>
                    <div className="product-form-modal" onClick={e => e.stopPropagation()}>
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
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th className="desktop-only-cell">Unit</th>
                            <th className="desktop-only-cell">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="no-data">
                                    No products found
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map(product => (
                                <Fragment key={product.id}>
                                    <tr
                                        className={`product-row ${expandedRowId === product.id ? 'expanded' : ''}`}
                                        onClick={() => setExpandedRowId(expandedRowId === product.id ? null : product.id)}
                                    >
                                        <td>
                                            <div className="product-name">{formatName(product.name)}</div>
                                        </td>
                                        <td>
                                            <span className="category-badge">{formatName(product.category)}</span>
                                        </td>
                                        <td>
                                            <span className="current-price">₹{product.price}</span>
                                        </td>
                                        <td className="desktop-only-cell">{product.unit}</td>
                                        <td className="desktop-only-cell">
                                            <span className={`status-badge ${product.active ? 'active' : 'inactive'}`}>
                                                {product.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                    {expandedRowId === product.id && (
                                        <tr className="actions-expanded-row">
                                            <td colSpan="5">
                                                <div className="expanded-content animate-fadeIn">
                                                    <div className="expanded-info">
                                                        <p className="full-desc"><strong>Description:</strong> {product.description || 'No description available'}</p>
                                                        <div className="mobile-only-info">
                                                            <p><strong>Unit:</strong> {product.unit}</p>
                                                            <p><strong>Status:</strong> {product.active ? 'Active' : 'Inactive'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="row-actions">
                                                        <button
                                                            className="btn-action-primary"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleManageVariants(product.id);
                                                            }}
                                                        >
                                                            <Layers size={16} /> Variants
                                                        </button>
                                                        <button
                                                            className="btn-action-edit"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEdit(product);
                                                            }}
                                                        >
                                                            <Edit2 size={16} /> Edit
                                                        </button>
                                                        <button
                                                            className="btn-action-delete"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(product.id);
                                                            }}
                                                        >
                                                            <Trash2 size={16} /> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {showVariantsId === product.id && (
                                        <tr className="variants-row">
                                            <td colSpan="5">
                                                <div className="variants-container">
                                                    <div className="variants-header">
                                                        <h4>Variants for {formatName(product.name)}</h4>
                                                        <button
                                                            className="btn-close-variants"
                                                            onClick={() => setShowVariantsId(null)}
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>

                                                    <form className="variant-form" onSubmit={handleSaveVariant}>
                                                        <div className="variant-inputs">
                                                            <div className="v-field">
                                                                <label>Qty Value</label>
                                                                <input
                                                                    type="number"
                                                                    name="quantityValue"
                                                                    value={variantFormData.quantityValue}
                                                                    onChange={handleVariantChange}
                                                                    placeholder="e.g. 5"
                                                                    step="0.01"
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="v-field">
                                                                <label>Unit</label>
                                                                <select
                                                                    name="quantityUnit"
                                                                    value={variantFormData.quantityUnit}
                                                                    onChange={handleVariantChange}
                                                                >
                                                                    <option value="Kg">Kg</option>
                                                                    <option value="Gm">Gm</option>
                                                                    <option value="L">L</option>
                                                                    <option value="Ml">Ml</option>
                                                                    <option value="Piece">Piece</option>
                                                                    <option value="Pack">Pack</option>
                                                                </select>
                                                            </div>
                                                            <div className="v-field">
                                                                <label>Price (₹)</label>
                                                                <input
                                                                    type="number"
                                                                    name="price"
                                                                    value={variantFormData.price}
                                                                    onChange={handleVariantChange}
                                                                    placeholder="0.00"
                                                                    step="0.01"
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="v-actions">
                                                                <button type="submit" className="btn-v-save" disabled={variantLoading}>
                                                                    {editingVariantId ? <Save size={16} /> : <Plus size={16} />}
                                                                    {editingVariantId ? 'Update' : 'Add'}
                                                                </button>
                                                                {editingVariantId && (
                                                                    <button type="button" className="btn-v-cancel" onClick={resetVariantForm}>
                                                                        <X size={16} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </form>

                                                    <div className="variants-list">
                                                        {variantLoading && variants.length === 0 ? (
                                                            <div className="v-loading">Loading variants...</div>
                                                        ) : variants.length === 0 ? (
                                                            <div className="v-empty">No variants added yet.</div>
                                                        ) : (
                                                            <table className="v-table">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Quantity</th>
                                                                        <th>Price</th>
                                                                        <th>Status</th>
                                                                        <th>Actions</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {variants.map(v => (
                                                                        <tr key={v.id}>
                                                                            <td>{v.quantityValue} {v.quantityUnit}</td>
                                                                            <td>₹{v.price}</td>
                                                                            <td>
                                                                                <span className={`v-status ${v.active ? 'active' : 'inactive'}`}>
                                                                                    {v.active ? 'Active' : 'Inactive'}
                                                                                </span>
                                                                            </td>
                                                                            <td>
                                                                                <div className="v-row-actions">
                                                                                    <button type="button" className="v-btn-e" onClick={() => handleEditVariant(v)}><Pencil size={14} /></button>
                                                                                    <button type="button" className="v-btn-d" onClick={() => handleDeleteVariant(v.id)}><Trash size={14} /></button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
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
