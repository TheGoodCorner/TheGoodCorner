import { create } from 'zustand'
import {
  fetchProductByIdRequest,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest,
} from '../api/productApi'

// Données de démonstration déjà au format du contrat (contrat-api.md) :
// category/author imbriqués, imageUrl, stock. Pas de `description` — cette
// colonne n'existe pas sur Product côté Prisma pour l'instant.
// const mockProducts = [
//   { id: 0, name: "Gants de Boxe Yokkao Elite", price: 85, imageUrl: "/Images_db_test/image_0.jpg", stock: 5, category: { id: 1, name: "Professional" }, author: { id: 1, username: "Max", avatar: null, sellerRating: 4.8, sellerReviewCount: 165, createdAt: "2021-01-15T00:00:00.000Z" } },
//   { id: 13, name: "Gants d'Entraînement Basic", price: 35, imageUrl: "/Images_db_test/image_1.jpg", stock: 12, category: { id: 2, name: "Training" }, author: { id: 2, username: "Khalid", avatar: null, sellerRating: 4.3, sellerReviewCount: 124, createdAt: "2022-06-03T00:00:00.000Z" } },
//   { id: 2, name: "Gants Muay Thai Premium", price: 65, imageUrl: "/Images_db_test/image_2.jpg", stock: 8, category: { id: 3, name: "Combat" }, author: { id: 3, username: "Thomas", avatar: null, sellerRating: 4.7, sellerReviewCount: 141, createdAt: "2020-11-20T00:00:00.000Z" } },
//   { id: 3, name: "Gants de Compétition Pro", price: 120, imageUrl: "/Images_db_test/image_3.jpg", stock: 3, category: { id: 1, name: "Professional" }, author: { id: 1, username: "Max", avatar: null, sellerRating: 4.8, sellerReviewCount: 165, createdAt: "2021-01-15T00:00:00.000Z" } },
//   { id: 4, name: "Gants pour Débutants", price: 25, imageUrl: "/Images_db_test/image_4.jpg", stock: 20, category: { id: 4, name: "Cardio" }, author: { id: 2, username: "Khalid", avatar: null, sellerRating: 4.3, sellerReviewCount: 124, createdAt: "2022-06-03T00:00:00.000Z" } },
//   { id: 5, name: "Gants d'Entraînement Intensif", price: 50, imageUrl: "/Images_db_test/image_5.jpg", stock: 9, category: { id: 2, name: "Training" }, author: { id: 3, username: "Thomas", avatar: null, sellerRating: 4.7, sellerReviewCount: 141, createdAt: "2020-11-20T00:00:00.000Z" } },
//   { id: 6, name: "Gants Loisir Confort", price: 30, imageUrl: "/Images_db_test/image_6.jpg", stock: 15, category: { id: 4, name: "Cardio" }, author: { id: 1, username: "Max", avatar: null, sellerRating: 4.8, sellerReviewCount: 165, createdAt: "2021-01-15T00:00:00.000Z" } },
//   { id: 7, name: "Gants Boxe Anglaise", price: 95, imageUrl: "/Images_db_test/image_7.jpg", stock: 4, category: { id: 1, name: "Professional" }, author: { id: 2, username: "Khalid", avatar: null, sellerRating: 4.3, sellerReviewCount: 124, createdAt: "2022-06-03T00:00:00.000Z" } },
//   { id: 8, name: "Gants d'Entraînement Légers", price: 40, imageUrl: "/Images_db_test/image_8.jpg", stock: 11, category: { id: 2, name: "Training" }, author: { id: 3, username: "Thomas", avatar: null, sellerRating: 4.7, sellerReviewCount: 141, createdAt: "2020-11-20T00:00:00.000Z" } },
//   { id: 9, name: "Gants Kickboxing", price: 70, imageUrl: "/Images_db_test/image_9.jpg", stock: 6, category: { id: 3, name: "Combat" }, author: { id: 1, username: "Max", avatar: null, sellerRating: 4.8, sellerReviewCount: 165, createdAt: "2021-01-15T00:00:00.000Z" } },
//   { id: 10, name: "Gants Sparring", price: 55, imageUrl: "/Images_db_test/image_10.jpg", stock: 7, category: { id: 2, name: "Training" }, author: { id: 2, username: "Khalid", avatar: null, sellerRating: 4.3, sellerReviewCount: 124, createdAt: "2022-06-03T00:00:00.000Z" } },
//   { id: 11, name: "Gants Ultra Premium", price: 150, imageUrl: "/Images_db_test/image_11.jpg", stock: 2, category: { id: 1, name: "Professional" }, author: { id: 3, username: "Thomas", avatar: null, sellerRating: 4.7, sellerReviewCount: 141, createdAt: "2020-11-20T00:00:00.000Z" } },
// ];

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  
  // Produit de la fiche détail, indépendant de `products` — son propre
  // cycle de chargement, plus riche en champs.
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
      const data = await fetchAllProducts();
      console.log("response apres .json(): ", data)
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



  // selectedCategory est un NOM de catégorie (string) ; product.category
  // est désormais un objet { id, name } — comparaison sur .name.
  getFilteredProducts: () => {
    const { products, filters } = get()
    return products.filter((product) => {
      const matchSearch = product.name?.toLowerCase().includes(filters.search.toLowerCase())
      const matchCategory = !filters.selectedCategory || product.category?.name === filters.selectedCategory
      const matchPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice
      return matchSearch && matchCategory && matchPrice
    })
  },

  resetFilters: () =>
    set({
      filters: { search: '', selectedCategory: '', minPrice: 0, maxPrice: 200 },
    }),
  // Lecture locale instantanée (liste déjà chargée) — sert de
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