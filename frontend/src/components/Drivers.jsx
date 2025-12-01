import { useState, useEffect } from 'react';
import './CrudModule.css';

const Drivers = ({ user }) => {
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        license: '',
        phone: '',
        vehicle_id: ''
    });

    useEffect(() => {
        fetchDrivers();
        fetchVehicles();
    }, []);

    // Filter drivers based on search term
    const filteredDrivers = drivers.filter(driver =>
        driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.license?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.phone?.includes(searchTerm)
    );

    const fetchDrivers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/drivers');
            const data = await response.json();
            setDrivers(data);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        } finally {
            setLoading(false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingDriver
                ? `http://localhost:5000/api/drivers/${editingDriver.id}`
                : 'http://localhost:5000/api/drivers';

            const method = editingDriver ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchDrivers();
                closeModal();
            }
        } catch (error) {
            console.error('Error saving driver:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this driver?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/drivers/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchDrivers();
            } else {
                const errorText = await response.text();
                alert(`Failed to delete driver: ${errorText}`);
            }
        } catch (error) {
            console.error('Error deleting driver:', error);
            alert('Error deleting driver: Network error');
        }
    };

    const openModal = (driver = null) => {
        if (driver) {
            setEditingDriver(driver);
            setFormData({
                name: driver.name,
                license: driver.license,
                phone: driver.phone,
                vehicle_id: driver.vehicle_id || ''
            });
        } else {
            setEditingDriver(null);
            setFormData({ name: '', license: '', phone: '', vehicle_id: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingDriver(null);
        setFormData({ name: '', license: '', phone: '', vehicle_id: '' });
    };

    const getVehicleInfo = (vehicleId) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        return vehicle ? `${vehicle.license_plate} (${vehicle.model})` : 'N/A';
    };

    if (loading) {
        return <div className="loading">Loading drivers...</div>;
    }

    return (
        <div className="crud-module">
            <div className="module-header">
                <div>
                    <h1 className="module-title">Drivers</h1>
                    <p className="module-subtitle">Manage driver information</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Driver
                </button>
            </div>

            <div className="search-bar">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input
                    type="text"
                    placeholder="Search drivers by name, license, or phone..."
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
                            <th>License</th>
                            <th>Phone</th>
                            <th>Assigned Vehicle</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDrivers.length > 0 ? (
                            filteredDrivers.map((driver) => (
                                <tr key={driver.id}>
                                    <td>{driver.id}</td>
                                    <td>{driver.name}</td>
                                    <td><span className="badge badge-success">{driver.license}</span></td>
                                    <td>{driver.phone}</td>
                                    <td>{getVehicleInfo(driver.vehicle_id)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => openModal(driver)}
                                            >
                                                Edit
                                            </button>
                                            {(user?.role === 'admin' || user?.role === 'manager') && (
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(driver.id)}
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
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                    {searchTerm ? 'No drivers found matching your search' : 'No drivers available'}
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
                            <h2>{editingDriver ? 'Edit Driver' : 'Add Driver'}</h2>
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
                                <label htmlFor="license">License Number</label>
                                <input
                                    type="text"
                                    id="license"
                                    value={formData.license}
                                    onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="phone">Phone</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="vehicle_id">Assigned Vehicle</label>
                                <select
                                    id="vehicle_id"
                                    value={formData.vehicle_id}
                                    onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                                >
                                    <option value="">Select Vehicle</option>
                                    {vehicles.map((vehicle) => (
                                        <option key={vehicle.id} value={vehicle.id}>
                                            {vehicle.license_plate} - {vehicle.model}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-success">
                                    {editingDriver ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Drivers;
