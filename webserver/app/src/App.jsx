import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { useThemeStore } from './stores/themeStore';
import { useNotificationStore } from './stores/notifications';
import { useCartStore } from './stores/cartStore';
import { useProductStore } from './stores/productStore';
import { useAuthStore } from './stores/authStore';
import { useUserStore } from './stores/userStore';
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import Home from './pages/Home';
import Products from './pages/Produits';
import ProductDetail from './pages/ProduitDetail';
import Cart from './pages/Panier';
import Login from './pages/Login';
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
  const initAuth = useAuthStore((state) => state.initAuth);

    // Synchronise le thème du store avec l'attribut data-theme sur <html>.
    // C'est ce que lisent les tokens (styles/tokens.css) pour que toute
    // l'app réagisse au thème depuis un seul et même endroit.
    useEffect(() => {
      document.documentElement.dataset.theme = theme
    }, [theme])

    // Tentative de reconnexion silencieuse au démarrage, une seule fois
    // (voir authStore.initAuth) : le cookie refresh httpOnly, s'il existe
    // et est encore valide, restaure la session sans rien demander à
    // l'utilisateur.
    useEffect(() => {
      initAuth()
    }, [initAuth])

    useEffect(() => {
      const { isAuthenticated, initializing } = useAuthStore.getState();
      const { user } = useUserStore.getState();
      // Uniquement si :
      // - pas en cours d'initialisation du token
      // - utilisateur authentifié
      // - pas de données utilisateur déjà chargées
      if (!initializing && isAuthenticated && !user) {
        useUserStore.getState().fetchUser();
      }
    }, []);    
    
  return (
    <Router>
      <Routes>
        {/* Routes avec Navbar/Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Routes sans Navbar/Footer */}
        <Route element={<AuthLayout />}>
          <Route path="/authentication" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
