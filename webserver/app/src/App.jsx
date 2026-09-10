import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useThemeStore } from './stores/themeStore';
import { useProductStore } from './stores/productStore';
import { useAuthStore } from './stores/authStore';
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import TooManyRequests from './pages/TooManyRequests';
import './styles/style.css';
import './styles/tokens.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
/**
 * Le composant principal de l'application.
 * C'est le point d'entrée qui structure toute l'app.
 */
const Checkout = lazy(() => import('./pages/Checkout')); // lazy loading for improved performance score
const SuccessCheckout = lazy(() => import('./pages/SuccessCheckout'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Faq = lazy(() => import('./pages/Faq'));
const Settings = lazy(() => import('./pages/Settings'));
const Orders = lazy(() => import('./pages/Orders'));
const Profile = lazy(() => import('./pages/Profile'));
const SellerProfile = lazy(() => import('./pages/SellerProfile'));
const Messagerie = lazy(() => import('./pages/Messagerie'));
const Login = lazy(() => import('./pages/Login'));
const ProductDetail = lazy(() => import('./pages/ProduitDetail'));
const Produits = lazy(() => import('./pages/Produits'));

function App() {
  const theme = useThemeStore((state) => state.theme)
  const initAuth = useAuthStore((state) => state.initAuth);
  const initializing = useAuthStore((state) => state.initializing);
    // Synchronise le thème du store avec l'attribut data-theme sur <html>.
    // C'est ce que lisent les tokens (styles/tokens.css) pour que toute
    // l'app réagisse au thème depuis un seul et même endroit.
    useEffect(() => {
      document.documentElement.dataset.theme = theme;
    }, [theme])

    // Tentative de reconnexion silencieuse au démarrage, une seule fois
    // (voir authStore.initAuth) : le cookie refresh httpOnly, s'il existe
    // et est encore valide, restaure la session sans rien demander à
    // l'utilisateur.
    useEffect(() => {
      initAuth()
    }, [initAuth])

    useEffect(() => {
      useProductStore.getState().fetchProducts();
    }, []);
    if (initializing) {
    return null; // ou un spinner global minimal
  }
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Routes avec Navbar/Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Suspense fallback = {null}> <Produits /> </Suspense>} />
          <Route path="/products/:id" element={<Suspense fallback = {null}> <ProductDetail /> </Suspense>} />
          <Route path="/messagerie" element={<Suspense fallback = {null}> <Messagerie /> </Suspense>} />
          <Route path="/profile" element={<Suspense fallback = {null}> <Profile /> </Suspense>} />
          <Route path="/profile/:id" element={<Suspense fallback = {null}> <SellerProfile /> </Suspense>} />
          <Route path="/confidentialite" element={<Suspense fallback = {null}> <PrivacyPolicy /> </Suspense>} />
          <Route path="/conditions-generales" element={<Suspense fallback = {null}> <TermsOfService /> </Suspense>} />
          <Route path="/faq" element={<Suspense fallback = {null}> <Faq /> </Suspense>} />
          <Route path="/settings" element={<Suspense fallback = {null}> <Settings /> </Suspense>} />
          <Route path="/orders" element={<Suspense fallback = {null}> <Orders /> </Suspense>} />
        </Route>

        {/* Routes sans Navbar/Footer */}
        <Route element={<AuthLayout />}>
          <Route path="/authentication" element={<Suspense fallback = {null}> <Login /> </Suspense>} />
          <Route path="/checkout" element={ <Suspense fallback = {null}> <Checkout /> </Suspense>} />
          <Route path="/checkout/success" element={<Suspense fallback = {null}> <SuccessCheckout /> </Suspense>} />
        </Route>
      
      <Route path="*" element={<NotFound />} />
      <Route path="/rate-limiting" element={<TooManyRequests />} />

      </Routes>
    </Router>
  );
}

export default App;
