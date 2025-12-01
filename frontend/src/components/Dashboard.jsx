import { useState } from 'react';
import './Dashboard.css';
import Analytics from './Analytics';
import Suppliers from './Suppliers';
import Warehouses from './Warehouses';
import Customers from './Customers';
import Items from './Items';
import Vehicles from './Vehicles';
import Drivers from './Drivers';
import Shipments from './Shipments';

const Dashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'suppliers', label: 'Suppliers', icon: '📦' },
        { id: 'warehouses', label: 'Warehouses', icon: '🏭' },
        { id: 'customers', label: 'Customers', icon: '👥' },
        { id: 'items', label: 'Items', icon: '📋' },
        { id: 'vehicles', label: 'Vehicles', icon: '🚚' },
        { id: 'drivers', label: 'Drivers', icon: '👨‍✈️' },
        { id: 'shipments', label: 'Shipments', icon: '🚚' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Analytics />;
            case 'suppliers':
                return <Suppliers user={user} />;
            case 'warehouses':
                return <Warehouses user={user} />;
            case 'customers':
                return <Customers user={user} />;
            case 'items':
                return <Items user={user} />;
            case 'vehicles':
                return <Vehicles user={user} />;
            case 'drivers':
                return <Drivers user={user} />;
            case 'shipments':
                return <Shipments user={user} />;
            default:
                return <Analytics />;
        }
    };

    return (
        <div className="dashboard">
            <aside className="sidebar glass-card">
                <div className="sidebar-header">
                    <div className="logo">
                        <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                            <rect width="48" height="48" rx="12" fill="url(#gradient)" />
                            <path d="M14 18L24 12L34 18V30L24 36L14 30V18Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 18L24 24L34 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M24 24V36" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <defs>
                                <linearGradient id="gradient" x1="0" y1="0" x2="48" y2="48">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#ec4899" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h2>LogisticsPro</h2>
                </div>

                <nav className="sidebar-nav">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.id}
                            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <span className="nav-icon">{tab.icon}</span>
                            <span className="nav-label">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                            <div className="user-name">{user.username}</div>
                            <div className="user-role">
                                <span className={`badge badge-${user.role === 'admin' ? 'primary' : user.role === 'manager' ? 'success' : 'warning'}`}>
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={onLogout}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1H3zm9 4a1 1 0 10-2 0v2a1 1 0 102 0V7z" clipRule="evenodd" />
                            <path d="M10.5 5a.5.5 0 01.5.5v5a.5.5 0 01-1 0v-5a.5.5 0 01.5-.5z" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <div className="content-wrapper animate-fade-in">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
