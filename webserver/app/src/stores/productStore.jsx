import { create } from 'zustand'
import {
  fetchAllProducts,
  fetchProductByIdRequest,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest,
} from '../api/productApi'

export const useProductStore = create((set, get) => ({
  products: [],
  loading: true,
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
    maxPrice: 10000,
  },

  fetchProducts: async () => {
	if (get().products.length === 0) {
      set({ loading: true });
    }
    try {
      const data = await fetchAllProducts();
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
      return data;
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