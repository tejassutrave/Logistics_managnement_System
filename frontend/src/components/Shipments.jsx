import { useState, useEffect } from 'react';
import './CrudModule.css';

const Shipments = ({ user }) => {
    const [shipments, setShipments] = useState([]);
    const [items, setItems] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingShipment, setEditingShipment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        item_id: '',
        quantity: '',
        vehicle_id: '',
        driver_id: '',
        customer_id: '',
        shipment_date: '',
        status: 'pending'
    });

    useEffect(() => {
        Promise.all([
            fetchShipments(),
            fetchItems(),
            fetchVehicles(),
            fetchDrivers(),
            fetchCustomers()
        ]).finally(() => setLoading(false));
    }, []);

    // Filter shipments based on search term
    const filteredShipments = shipments.filter(shipment =>
        shipment.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.id?.toString().includes(searchTerm)
    );

    const fetchShipments = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/shipments');
            const data = await response.json();
            setShipments(data);
        } catch (error) {
            console.error('Error fetching shipments:', error);
        }
    };

    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/items');
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const fetchVehicles = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/vehicles');
            const data = await response.json();
            setVehicles(data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const fetchDrivers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/drivers');
            const data = await response.json();
            setDrivers(data);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/customers');
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingShipment
                ? `http://localhost:5000/api/shipments/${editingShipment.id}`
                : 'http://localhost:5000/api/shipments';

            const method = editingShipment ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchShipments();
                closeModal();
            }
        } catch (error) {
            console.error('Error saving shipment:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this shipment?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/shipments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchShipments();
            } else {
                const errorText = await response.text();
                alert(`Failed to delete shipment: ${errorText}`);
            }
        } catch (error) {
            console.error('Error deleting shipment:', error);
            alert('Error deleting shipment: Network error');
        }
    };

    const openModal = (shipment = null) => {
        if (shipment) {
            setEditingShipment(shipment);
            setFormData({
                item_id: shipment.item_id,
                quantity: shipment.quantity,
                vehicle_id: shipment.vehicle_id,
                driver_id: shipment.driver_id,
                customer_id: shipment.customer_id,
                shipment_date: shipment.shipment_date.split('T')[0], // Format date for input
                status: shipment.status
            });
        } else {
            setEditingShipment(null);
            setFormData({
                item_id: '',
                quantity: '',
                vehicle_id: '',
                driver_id: '',
                customer_id: '',
                shipment_date: new Date().toISOString().split('T')[0],
                status: 'pending'
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingShipment(null);
        setFormData({
            item_id: '',
            quantity: '',
            vehicle_id: '',
            driver_id: '',
            customer_id: '',
            shipment_date: '',
            status: 'pending'
        });
    };

    const getItemName = (id) => items.find(i => i.id === id)?.name || 'N/A';
    const getVehicleName = (id) => vehicles.find(v => v.id === id)?.license_plate || 'N/A';
    const getDriverName = (id) => drivers.find(d => d.id === id)?.name || 'N/A';
    const getCustomerName = (id) => customers.find(c => c.id === id)?.name || 'N/A';

    if (loading) {
        return <div className="loading">Loading shipments...</div>;
    }

    return (
        <div className="crud-module">
            <div className="module-header">
                <div>
                    <h1 className="module-title">Shipments</h1>
                    <p className="module-subtitle">Manage delivery shipments</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Shipment
                </button>
            </div>

            <div className="search-bar">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input
                    type="text"
                    placeholder="Search shipments by status or ID..."
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
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Vehicle</th>
                            <th>Driver</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredShipments.length > 0 ? (
                            filteredShipments.map((shipment) => (
                                <tr key={shipment.id}>
                                    <td>{shipment.id}</td>
                                    <td>{getItemName(shipment.item_id)}</td>
                                    <td>{shipment.quantity}</td>
                                    <td>{getVehicleName(shipment.vehicle_id)}</td>
                                    <td>{getDriverName(shipment.driver_id)}</td>
                                    <td>{getCustomerName(shipment.customer_id)}</td>
                                    <td>{new Date(shipment.shipment_date).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge badge-${shipment.status === 'delivered' ? 'success' :
                                            shipment.status === 'in_transit' ? 'primary' : 'warning'
                                            }`}>
                                            {shipment.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => openModal(shipment)}
                                            >
                                                Edit
                                            </button>
                                            {(user?.role === 'admin' || user?.role === 'manager') && (
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(shipment.id)}
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
                                <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                    {searchTerm ? 'No shipments found matching your search' : 'No shipments available'}
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
                            <h2>{editingShipment ? 'Edit Shipment' : 'Add Shipment'}</h2>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="item_id">Item</label>
                                <select
                                    id="item_id"
                                    value={formData.item_id}
                                    onChange={(e) => setFormData({ ...formData, item_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Item</option>
                                    {items.map(item => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label htmlFor="quantity">Quantity</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="vehicle_id">Vehicle</label>
                                <select
                                    id="vehicle_id"
                                    value={formData.vehicle_id}
                                    onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                                >
                                    <option value="">Select Vehicle</option>
                                    {vehicles.map(vehicle => (
                                        <option key={vehicle.id} value={vehicle.id}>{vehicle.license_plate}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label htmlFor="driver_id">Driver</label>
                                <select
                                    id="driver_id"
                                    value={formData.driver_id}
                                    onChange={(e) => setFormData({ ...formData, driver_id: e.target.value })}
                                >
                                    <option value="">Select Driver</option>
                                    {drivers.map(driver => (
                                        <option key={driver.id} value={driver.id}>{driver.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label htmlFor="customer_id">Customer</label>
                                <select
                                    id="customer_id"
                                    value={formData.customer_id}
                                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                                >
                                    <option value="">Select Customer</option>
                                    {customers.map(customer => (
                                        <option key={customer.id} value={customer.id}>{customer.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label htmlFor="shipment_date">Date</label>
                                <input
                                    type="date"
                                    id="shipment_date"
                                    value={formData.shipment_date}
                                    onChange={(e) => setFormData({ ...formData, shipment_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_transit">In Transit</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-success">
                                    {editingShipment ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Shipments;
