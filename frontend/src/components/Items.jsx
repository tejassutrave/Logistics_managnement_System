import { useState, useEffect } from 'react';
import './CrudModule.css';

const Items = ({ user }) => {
    const [items, setItems] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        weight: '',
        price: '',
        warehouse_id: '',
        supplier_id: ''
    });

    useEffect(() => {
        fetchItems();
        fetchWarehouses();
        fetchSuppliers();
    }, []);

    // Filter items based on search term
    const filteredItems = items.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.price?.toString().includes(searchTerm) ||
        item.weight?.toString().includes(searchTerm)
    );

    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/items');
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/warehouses');
            const data = await response.json();
            setWarehouses(data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/suppliers');
            const data = await response.json();
            setSuppliers(data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingItem
                ? `http://localhost:5000/api/items/${editingItem.id}`
                : 'http://localhost:5000/api/items';

            const method = editingItem ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchItems();
                closeModal();
            }
        } catch (error) {
            console.error('Error saving item:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/items/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchItems();
            } else {
                const errorText = await response.text();
                alert(`Failed to delete item: ${errorText}`);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item: Network error');
        }
    };

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                weight: item.weight,
                price: item.price,
                warehouse_id: item.warehouse_id || '',
                supplier_id: item.supplier_id || ''
            });
        } else {
            setEditingItem(null);
            setFormData({ name: '', weight: '', price: '', warehouse_id: '', supplier_id: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setFormData({ name: '', weight: '', price: '', warehouse_id: '', supplier_id: '' });
    };

    const getWarehouseName = (warehouseId) => {
        const warehouse = warehouses.find(w => w.id === warehouseId);
        return warehouse ? warehouse.name : 'N/A';
    };

    const getSupplierName = (supplierId) => {
        const supplier = suppliers.find(s => s.id === supplierId);
        return supplier ? supplier.name : 'N/A';
    };

    if (loading) {
        return <div className="loading">Loading items...</div>;
    }

    return (
        <div className="crud-module">
            <div className="module-header">
                <div>
                    <h1 className="module-title">Items</h1>
                    <p className="module-subtitle">Manage inventory items</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Item
                </button>
            </div>

            <div className="search-bar">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input
                    type="text"
                    placeholder="Search items by name, price, or weight..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button className="clear-search" onClick={() => setSearchTerm('')}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Weight (kg)</th>
                            <th>Price ($)</th>
                            <th>Warehouse</th>
                            <th>Supplier</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.weight}</td>
                                    <td>${parseFloat(item.price).toFixed(2)}</td>
                                    <td>{getWarehouseName(item.warehouse_id)}</td>
                                    <td>{getSupplierName(item.supplier_id)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => openModal(item)}
                                            >
                                                Edit
                                            </button>
                                            {(user?.role === 'admin' || user?.role === 'manager') && (
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                    {searchTerm ? 'No items found matching your search' : 'No items available'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingItem ? 'Edit Item' : 'Add Item'}</h2>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="name">Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="weight">Weight (kg)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    id="weight"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="price">Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    id="price"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="warehouse_id">Warehouse</label>
                                <select
                                    id="warehouse_id"
                                    value={formData.warehouse_id}
                                    onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })}
                                >
                                    <option value="">Select Warehouse</option>
                                    {warehouses.map((warehouse) => (
                                        <option key={warehouse.id} value={warehouse.id}>
                                            {warehouse.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label htmlFor="supplier_id">Supplier</label>
                                <select
                                    id="supplier_id"
                                    value={formData.supplier_id}
                                    onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                                >
                                    <option value="">Select Supplier</option>
                                    {suppliers.map((supplier) => (
                                        <option key={supplier.id} value={supplier.id}>
                                            {supplier.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-success">
                                    {editingItem ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Items;
