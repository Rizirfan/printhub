import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Box, Sun, Moon, LogOut } from 'lucide-react';

import CustomerDashboard from './pages/CustomerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import FindPartners from './pages/FindPartners';
import { AuthProvider, useAuth } from './context/AuthContext';

interface Job {
  id: string;
  item: string;
  material: string;
  quality: string;
  status: 'Pending' | 'In Progress' | 'Shipped' | 'Delivered';
  rev: string;
  time: string;
  timestamp: Date;
}

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'user' | 'partner' }) => {
  const { user, token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'partner' ? '/partner' : '/customer'} replace />;
  }
  
  return <>{children}</>;
};

const Navbar = ({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isVendor = location.pathname === '/partner';
  const isLanding = location.pathname === '/';

  return (
    <nav style={{ padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Box className="gradient-text" style={{ width: '32px', height: '32px', color: 'var(--accent-primary)' }} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Print<span className="gradient-text">Hub</span></h1>
      </Link>
      
      <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {!isVendor && !isLanding && (
          <div className="desktop-only" style={{ display: 'flex', gap: '1.5rem', marginRight: '1rem' }}>
            <Link to="/partners" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Find Partners</Link>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Materials</a>
          </div>
        )}
        
        <button 
          onClick={toggleTheme}
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)', transition: 'all 0.3s' }}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Welcome, {user.name.split(' ')[0]}</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', color: 'white' }}>
              {user.name[0]}
            </div>
            <button 
              onClick={() => {
                logout();
                navigate('/');
              }}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="btn-container" style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/login')}>Log In</button>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Sign Up</button>
          </div>
        )}
      </div>
    </nav>
  );
};

function AppContent() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className="app-container">
      <main className="main-content">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/customer" element={
            <ProtectedRoute role="user">
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/partners" element={
            <ProtectedRoute role="user">
              <FindPartners />
            </ProtectedRoute>
          } />
          <Route path="/partner" element={
            <ProtectedRoute role="partner">
              <VendorDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
