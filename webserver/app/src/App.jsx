import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useThemeStore } from './stores/themeStore';
import { useNotificationStore } from './stores/notifications';
import { useCartStore } from './stores/cartStore';
import { useProductStore } from './stores/productStore';
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import Home from './pages/Home';
import Products from './pages/Produits';
import Cart from './pages/Panier';
import {CartPopover} from './pages/CartPopover'; 
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import './styles/style.css';
import './styles/tokens.css';


/**
 * Le composant principal de l'application.
 * C'est le point d'entrée qui structure toute l'app.
 */
function App() {
  const theme = useThemeStore((state) => state.theme)

    // Synchronise le thème du store avec l'attribut data-theme sur <html>.
    // C'est ce que lisent les tokens (styles/tokens.css) pour que toute
    // l'app réagisse au thème depuis un seul et même endroit.
    useEffect(() => {
      document.documentElement.dataset.theme = theme
    }, [theme])
    
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <CartPopover />
      <Footer />
    </Router>
  );
}

export default App;
