import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import '../styles/Navbar.css';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🏎️ Gran Turismo
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="admin-badge" title="Go to Admin Dashboard">
                  ADMIN ⚙️
                </Link>
              )}

              <span className="nav-user">👤 {user.username}</span>
              
              <button onClick={logout} className="nav-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};