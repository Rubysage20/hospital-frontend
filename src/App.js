import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DoctorsView from './components/DoctorsView';
import PatientsView from './components/PatientsView';
import EmployeesView from './components/EmployeesView';
import AppointmentsView from './components/AppointmentsView';
import ReportsView from './components/ReportsView';
import './styles/dashboard.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    console.log('🔍 Checking authentication on mount...');
    console.log('Token exists:', !!token);
    console.log('User exists:', !!savedUser);
    
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
      console.log('✅ User is authenticated');
    } else {
      console.log('❌ User is NOT authenticated');
    }
  }, []);

  const handleLoginSuccess = (data) => {
    console.log('🎉 Login success callback received');
    setIsAuthenticated(true);
    setUser(data.user);
  };

  const handleLogout = () => {
    console.log('👋 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('overview');
  };

  const renderView = () => {
    switch(currentView) {
      case 'overview':
        return <Dashboard />;
      case 'doctors':
        return <DoctorsView />;
      case 'patients':
        return <PatientsView />;
      case 'employees':
        return <EmployeesView />;
      case 'appointments':
        return <AppointmentsView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <Dashboard />;
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    console.log('🔒 Rendering login page');
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Show main dashboard if authenticated
  console.log('🏠 Rendering dashboard');
  return (
    <div className={`dashboard ${menuOpen ? "menu-open" : ""}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <span className="logo-dot" />
          <span className="brand-text">Hospital<span>Dash</span></span>
        </div>

        <nav className="nav">
          <button 
            className={`nav-item ${currentView === 'overview' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('overview');
              setMenuOpen(false);
            }}
          >
            Overview
          </button>
          <button 
            className={`nav-item ${currentView === 'doctors' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('doctors');
              setMenuOpen(false);
            }}
          >
            Doctors
          </button>
          <button 
            className={`nav-item ${currentView === 'patients' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('patients');
              setMenuOpen(false);
            }}
          >
            Patients
          </button>
          <button 
            className={`nav-item ${currentView === 'employees' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('employees');
              setMenuOpen(false);
            }}
          >
            Employees
          </button>
          <button 
            className={`nav-item ${currentView === 'appointments' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('appointments');
              setMenuOpen(false);
            }}
          >
            Appointments
          </button>
          <button 
            className={`nav-item ${currentView === 'reports' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('reports');
              setMenuOpen(false);
            }}
          >
            Reports
          </button>
        </nav>

        <div className="sidebar-footer">
          <small>© {new Date().getFullYear()} HMS</small>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        <header className="topbar">
          <button
            className="burger"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(v => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <h1>
            {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
          </h1>

          <div className="topbar-actions">
            <span style={{ marginRight: '1rem', color: '#666' }}>
              Welcome, {user?.username}
            </span>
            <button 
              className="btn refresh" 
              onClick={() => window.location.reload()}
              title="Refresh data"
            >
              ↻
            </button>
            <button 
              className="btn secondary"
              onClick={handleLogout}
              style={{ marginLeft: '0.5rem' }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Render Current View */}
        <div style={{ padding: '2rem' }}>
          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default App;