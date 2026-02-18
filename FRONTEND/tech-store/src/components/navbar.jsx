import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { count } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo">TECH<span>STORE</span></Link>
        <div className="nav-links">
          <Link to="/" className={`nav-item ${isActive('/')}`}>
            HOME
          </Link>
          <Link to="/admin" className={`nav-item ${isActive('/admin')}`}>
            ADMIN
          </Link>
          <Link to="/cart" className={`nav-item ${isActive('/cart')}`}>
            <div className="cart-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {count > 0 && <span className="cart-badge">{count}</span>}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}