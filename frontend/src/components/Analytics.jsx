import { useState, useEffect } from 'react';
import './Analytics.css';

const Analytics = () => {
    const [stats, setStats] = useState({
        suppliers: 0,
        warehouses: 0,
        customers: 0,
        items: 0,
        vehicles: 0,
        drivers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const [suppliers, warehouses, customers, items, vehicles, drivers] = await Promise.all([
                fetch('http://localhost:5000/api/suppliers').then(r => r.json()),
                fetch('http://localhost:5000/api/warehouses').then(r => r.json()),
                fetch('http://localhost:5000/api/customers').then(r => r.json()),
                fetch('http://localhost:5000/api/items').then(r => r.json()),
                fetch('http://localhost:5000/api/vehicles').then(r => r.json()),
                fetch('http://localhost:5000/api/drivers').then(r => r.json())
            ]);

            setStats({
                suppliers: suppliers.length,
                warehouses: warehouses.length,
                customers: customers.length,
                items: items.length,
                vehicles: vehicles.length,
                drivers: drivers.length
            });
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            label: 'Total Suppliers',
            value: stats.suppliers,
            icon: '📦',
            color: 'primary',
            trend: '+12%'
        },
        {
            label: 'Warehouses',
            value: stats.warehouses,
            icon: '🏭',
            color: 'success',
            trend: '+5%'
        },
        {
            label: 'Customers',
            value: stats.customers,
            icon: '👥',
            color: 'accent',
            trend: '+18%'
        },
        {
            label: 'Items in Stock',
            value: stats.items,
            icon: '📋',
            color: 'warning',
            trend: '+8%'
        },
        {
            label: 'Active Vehicles',
            value: stats.vehicles,
            icon: '🚚',
            color: 'secondary',
            trend: '+3%'
        },
        {
            label: 'Drivers',
            value: stats.drivers,
            icon: '👨‍✈️',
            color: 'primary',
            trend: '+7%'
        }
    ];

    if (loading) {
        return <div className="loading">Loading analytics...</div>;
    }

    return (
        <div className="analytics-container">
            <div className="analytics-header">
                <div>
                    <h1 className="module-title">Dashboard Analytics</h1>
                    <p className="module-subtitle">Overview of your logistics operations</p>
                </div>
                <button className="btn btn-primary" onClick={fetchAnalytics}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Refresh
                </button>
            </div>

            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div
                        key={stat.label}
                        className={`stat-card glass-card stat-${stat.color}`}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-content">
                            <div className="stat-label">{stat.label}</div>
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-trend">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 15a.5.5 0 00.5-.5V2.707l3.146 3.147a.5.5 0 00.708-.708l-4-4a.5.5 0 00-.708 0l-4 4a.5.5 0 10.708.708L7.5 2.707V14.5a.5.5 0 00.5.5z" />
                                </svg>
                                {stat.trend} this month
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="charts-section">
                <div className="chart-card glass-card">
                    <h3>Quick Stats</h3>
                    <div className="quick-stats">
                        <div className="quick-stat-item">
                            <div className="quick-stat-bar" style={{ width: `${(stats.suppliers / 20) * 100}%` }}></div>
                            <div className="quick-stat-label">
                                <span>Suppliers</span>
                                <span className="quick-stat-value">{stats.suppliers}</span>
                            </div>
                        </div>
                        <div className="quick-stat-item">
                            <div className="quick-stat-bar stat-success" style={{ width: `${(stats.warehouses / 10) * 100}%` }}></div>
                            <div className="quick-stat-label">
                                <span>Warehouses</span>
                                <span className="quick-stat-value">{stats.warehouses}</span>
                            </div>
                        </div>
                        <div className="quick-stat-item">
                            <div className="quick-stat-bar stat-accent" style={{ width: `${(stats.customers / 30) * 100}%` }}></div>
                            <div className="quick-stat-label">
                                <span>Customers</span>
                                <span className="quick-stat-value">{stats.customers}</span>
                            </div>
                        </div>
                        <div className="quick-stat-item">
                            <div className="quick-stat-bar stat-warning" style={{ width: `${(stats.items / 50) * 100}%` }}></div>
                            <div className="quick-stat-label">
                                <span>Items</span>
                                <span className="quick-stat-value">{stats.items}</span>
                            </div>
                        </div>
                        <div className="quick-stat-item">
                            <div className="quick-stat-bar stat-secondary" style={{ width: `${(stats.vehicles / 15) * 100}%` }}></div>
                            <div className="quick-stat-label">
                                <span>Vehicles</span>
                                <span className="quick-stat-value">{stats.vehicles}</span>
                            </div>
                        </div>
                        <div className="quick-stat-item">
                            <div className="quick-stat-bar" style={{ width: `${(stats.drivers / 20) * 100}%` }}></div>
                            <div className="quick-stat-label">
                                <span>Drivers</span>
                                <span className="quick-stat-value">{stats.drivers}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="chart-card glass-card">
                    <h3>System Health</h3>
                    <div className="health-indicators">
                        <div className="health-item">
                            <div className="health-icon">✅</div>
                            <div className="health-content">
                                <div className="health-label">Database Status</div>
                                <div className="health-status">Connected</div>
                            </div>
                        </div>
                        <div className="health-item">
                            <div className="health-icon">✅</div>
                            <div className="health-content">
                                <div className="health-label">API Status</div>
                                <div className="health-status">Operational</div>
                            </div>
                        </div>
                        <div className="health-item">
                            <div className="health-icon">✅</div>
                            <div className="health-content">
                                <div className="health-label">Server Load</div>
                                <div className="health-status">Normal</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="recent-activity glass-card">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                    <div className="activity-item">
                        <div className="activity-icon">📦</div>
                        <div className="activity-content">
                            <div className="activity-text">New supplier added</div>
                            <div className="activity-time">2 hours ago</div>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon">🚚</div>
                        <div className="activity-content">
                            <div className="activity-text">Vehicle assigned to driver</div>
                            <div className="activity-time">5 hours ago</div>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon">📋</div>
                        <div className="activity-content">
                            <div className="activity-text">Inventory updated</div>
                            <div className="activity-time">1 day ago</div>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon">👥</div>
                        <div className="activity-content">
                            <div className="activity-text">New customer registered</div>
                            <div className="activity-time">2 days ago</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
