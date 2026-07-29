import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">🛍️ MyShop</Link>
        <ul className="nav-menu">
          <li><Link to="/" className="nav-link">Accueil</Link></li>
          <li><Link to="/products" className="nav-link">Produits</Link></li>
          <li><Link to="/cart" className="nav-link">Panier</Link></li>
          <li><Link to="/contact" className="nav-link">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
