import { useState, useEffect } from 'react';
import './CrudModule.css';

const Vehicles = ({ user }) => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        license_plate: '',
        model: '',
        capacity: ''
    });

    useEffect(() => {
        fetchVehicles();
    }, []);

    // Filter vehicles based on search term
    const filteredVehicles = vehicles.filter(vehicle =>
        vehicle.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.capacity?.toString().includes(searchTerm)
    );

    const fetchVehicles = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/vehicles');
            const data = await response.json();
            setVehicles(data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingVehicle
                ? `http://localhost:5000/api/vehicles/${editingVehicle.id}`
                : 'http://localhost:5000/api/vehicles';

            const method = editingVehicle ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchVehicles();
                closeModal();
            }
        } catch (error) {
            console.error('Error saving vehicle:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this vehicle?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchVehicles();
            } else {
                const errorText = await response.text();
                alert(`Failed to delete vehicle: ${errorText}`);
            }
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            alert('Error deleting vehicle: Network error');
        }
    };

    const openModal = (vehicle = null) => {
        if (vehicle) {
            setEditingVehicle(vehicle);
            setFormData({
                license_plate: vehicle.license_plate,
                model: vehicle.model,
                capacity: vehicle.capacity
            });
        } else {
            setEditingVehicle(null);
            setFormData({ license_plate: '', model: '', capacity: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingVehicle(null);
        setFormData({ license_plate: '', model: '', capacity: '' });
    };

    if (loading) {
        return <div className="loading">Loading vehicles...</div>;
    }

    return (
        <div className="crud-module">
            <div className="module-header">
                <div>
                    <h1 className="module-title">Vehicles</h1>
                    <p className="module-subtitle">Manage fleet vehicles</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Vehicle
                </button>
            </div>

            <div className="search-bar">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input
                    type="text"
                    placeholder="Search vehicles by license plate, model, or capacity..."
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
                            <th>License Plate</th>
                            <th>Model</th>
                            <th>Capacity (kg)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVehicles.length > 0 ? (
                            filteredVehicles.map((vehicle) => (
                                <tr key={vehicle.id}>
                                    <td>{vehicle.id}</td>
                                    <td><span className="badge badge-primary">{vehicle.license_plate}</span></td>
                                    <td>{vehicle.model}</td>
                                    <td>{vehicle.capacity}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => openModal(vehicle)}
                                            >
                                                Edit
                                            </button>
                                            {(user?.role === 'admin' || user?.role === 'manager') && (
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(vehicle.id)}
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
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                    {searchTerm ? 'No vehicles found matching your search' : 'No vehicles available'}
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
                            <h2>{editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="license_plate">License Plate *</label>
                                <input
                                    type="text"
                                    id="license_plate"
                                    value={formData.license_plate}
                                    onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="model">Model</label>
                                <input
                                    type="text"
                                    id="model"
                                    value={formData.model}
                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="capacity">Capacity (kg)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    id="capacity"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-success">
                                    {editingVehicle ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vehicles;
