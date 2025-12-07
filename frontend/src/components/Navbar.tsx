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
              <span className="nav-user">👤 {user.username}</span>
              {user.role === 'admin' && <span className="admin-badge">ADMIN</span>}
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