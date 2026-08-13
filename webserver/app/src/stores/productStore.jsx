import { create } from 'zustand'
import {
  fetchProductByIdRequest,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest,
} from '../api/productApi'

// Données de démonstration en attendant le backend. Quand l'API existera,
// appelle fetchProducts()
const mockProducts = [
  { id: 0, image: "/Images_db_test/image_0.jpg", name: "Gants de Boxe Yokkao Elite", category: "Professional", price: 85, description: "Gants haut de gamme conçus pour la compétition, cuir véritable et rembourrage optimisé pour la protection des poings.", owner: "Max", ownerRating: 4.8, ownerReviewCount: 42 },
  { id: 13, image: "/Images_db_test/image_1.jpg", name: "Gants d'Entraînement Basic", category: "Training", price: 35, description: "Parfaits pour débuter, ces gants offrent un bon compromis entre confort et durabilité pour vos séances régulières.", owner: "Khalid", ownerRating: 4.5, ownerReviewCount: 28 },
  { id: 2, image: "/Images_db_test/image_2.jpg", name: "Gants Muay Thai Premium", category: "Combat", price: 65, description: "Conçus spécifiquement pour le Muay Thai, avec un poignet renforcé et une mousse haute densité pour absorber les chocs.", owner: "Thomas", ownerRating: 4.9, ownerReviewCount: 65 },
  { id: 3, image: "/Images_db_test/image_3.jpg", name: "Gants de Compétition Pro", category: "Professional", price: 120, description: "Le choix des compétiteurs exigeants : finitions soignées, maintien optimal du poignet et amorti premium.", owner: "Max", ownerRating: 4.7, ownerReviewCount: 51 },
  { id: 4, image: "/Images_db_test/image_4.jpg", name: "Gants pour Débutants", category: "Cardio", price: 25, description: "Légers et confortables, idéaux pour découvrir la boxe cardio sans se ruiner.", owner: "Khalid", ownerRating: 1.3, ownerReviewCount: 19 },
  { id: 5, image: "/Images_db_test/image_5.jpg", name: "Gants d'Entraînement Intensif", category: "Training", price: 50, description: "Pensés pour les séances intenses, avec une ventilation renforcée et un rembourrage résistant.", owner: "Thomas", ownerRating: 4.6, ownerReviewCount: 37 },
  { id: 6, image: "/Images_db_test/image_6.jpg", name: "Gants Loisir Confort", category: "Cardio", price: 30, description: "Un confort optimal pour vos entraînements loisir, sans compromis sur la protection.", owner: "Max", ownerRating: 4.4, ownerReviewCount: 24 },
  { id: 7, image: "/Images_db_test/image_7.jpg", name: "Gants Boxe Anglaise", category: "Professional", price: 95, description: "Spécialement conçus pour la boxe anglaise, avec une prise en main précise et un excellent maintien du poignet.", owner: "Khalid", ownerRating: 3.7, ownerReviewCount: 33 },
  { id: 8, image: "/Images_db_test/image_8.jpg", name: "Gants d'Entraînement Légers", category: "Training", price: 40, description: "Légers et souples, parfaits pour travailler la vitesse et la technique.", owner: "Thomas", ownerRating: 4.5, ownerReviewCount: 29 },
  { id: 9, image: "/Images_db_test/image_9.jpg", name: "Gants Kickboxing", category: "Combat", price: 70, description: "Robustes et bien rembourrés, conçus pour encaisser les échanges intenses du kickboxing.", owner: "Max", ownerRating: 4.8, ownerReviewCount: 58 },
  { id: 10, image: "/Images_db_test/image_10.jpg", name: "Gants Sparring", category: "Training", price: 55, description: "Un amorti généreux pour protéger votre partenaire d'entraînement autant que vous-même.", owner: "Khalid", ownerRating: 4.6, ownerReviewCount: 44 },
  { id: 11, image: "/Images_db_test/image_11.jpg", name: "Gants Ultra Premium", category: "Professional", price: 150, description: "Le nec plus ultra : cuir premium, finitions artisanales et performance de niveau professionnel.", owner: "Thomas", ownerRating: 2.9, ownerReviewCount: 72 },
];


export const useProductStore = create((set, get) => ({
  products: mockProducts,
  loading: false,
  error: null,
  
  // Produit de la fiche détail, indépendant de `products` — son propre
  // cycle de chargement, potentiellement plus riche en champs.
  currentProduct: null,
  currentProductLoading: false,
  currentProductError: null,
  
  filters: {
    search: '',
    selectedCategory: '',
    minPrice: 0,
    maxPrice: 200,
  },

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      set({ products: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  // GET /products/:id — toujours appelé au montage de la fiche, même si
  // une version "light" est déjà en cache dans `products` : c'est le seul
  // moyen d'obtenir les champs propres au détail (avis, stock...) et une
  // donnée à jour.
  fetchProductById: async (id) => {
    set({ currentProductLoading: true, currentProductError: null });
    try {
      const data = await fetchProductByIdRequest(id);
      set({ currentProduct: data, currentProductLoading: false });
      return data;
    } catch (err) {
      set({ currentProductError: err.message, currentProductLoading: false });
    }
  },

  // POST /products
  createProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const data = await createProductRequest(productData);
      set((state) => ({ products: [...state.products, data], loading: false }));
   const updatedState = get();
    console.log("Produits après ajout:", updatedState.products);      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // PUT /products/:id
  updateProduct: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const data = await updateProductRequest(id, updates);
      set((state) => ({
        products: state.products.map((p) => (String(p.id) === String(id) ? data : p)),
        currentProduct:
          state.currentProduct && String(state.currentProduct.id) === String(id)
            ? data
            : state.currentProduct,
        loading: false,
      }));
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // DELETE /products/:id
  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteProductRequest(id);
      set((state) => ({
        products: state.products.filter((p) => String(p.id) !== String(id)),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },



  getFilteredProducts: () => {
    const { products, filters } = get()
    return products.filter((product) => {
      const matchSearch = product.name?.toLowerCase().includes(filters.search.toLowerCase())
      const matchCategory = !filters.selectedCategory || product.category === filters.selectedCategory
      const matchPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice
      return matchSearch && matchCategory && matchPrice
    })
  },

  resetFilters: () =>
    set({
      filters: { search: '', selectedCategory: '', minPrice: 0, maxPrice: 200 },
    }),
  // Lecture locale instantanée (mock ou liste déjà chargée) — sert de
  // placeholder pendant que fetchProductById va chercher la version complète.
  getProductById: (id) => {
    return get().products.find((p) => String(p.id) === String(id));
  },

  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
}))