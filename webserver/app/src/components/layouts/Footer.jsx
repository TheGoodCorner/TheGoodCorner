import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1 */}
          <div className="footer-column">
            <h3 className="footer-title">TheGoodCorner</h3>
            <p className="footer-text">
              Votre boutique en ligne pour les meilleurs produits handpickés.
            </p>
          </div>

          {/* Column 2 */}
          <div className="footer-column">
            <h3 className="footer-title">Navigation</h3>
            <ul className="footer-links">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/products">Produits</Link></li>
              <li><Link to="/authentication">Login / Sign up</Link></li>
              <li><Link to="/messagerie">Mes Discussions</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="footer-column">
            <h3 className="footer-title">Support</h3>
            <ul className="footer-links">
              <li><a href="#faq">FAQ</a></li>
              <li><Link to="/conditions-generales">Conditions générales</Link></li>
              <li><Link to="/confidentialite">Politique de confidentialité</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="footer-column">
            <h3 className="footer-title">Nous suivre</h3>
            <ul className="footer-links">
              <li><Facebook size={14}/><a href="#facebook">Facebook</a></li>
              <li><Twitter size={14}/><a href="#twitter">Twitter</a></li>
              <li><Instagram size={14}/><a href="#instagram">Instagram</a></li>
              <li><Linkedin size={14}/><a href="#linkedin">Linkedin</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-divider"></div>
        <div className="footer-bottom">
          <p>&copy; 2026 TheGoodCorner. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
