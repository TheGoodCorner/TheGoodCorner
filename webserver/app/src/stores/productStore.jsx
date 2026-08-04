import { create } from 'zustand'

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    selectedCategory: '',
    minPrice: 0,
    maxPrice: 1000,
  },

  // Récupérer tous les produits au démarrage
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

  // Filtrer les produits
  getFilteredProducts: () => {
    const { products, filters } = get()
    return products.filter((product) => {
      // Filtre par recherche texte
      const matchSearch = product.name?.toLowerCase().includes(filters.search.toLowerCase())
      // Filtre par catégorie
      const matchCategory = !filters.selectedCategory || product.category === filters.selectedCategory
      // Filtre par prix
      const matchPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice
      
      return matchSearch && matchCategory && matchPrice
    })
  },
  
  resetFilters: () =>
    set({
      filters: {
        search: '',
        selectedCategory: '',
        minPrice: 0,
        maxPrice: 1000,
      },
    }),

  // Récupérer un produit par ID (pour page détail)
  getProductById: (id) => {
    return get().products.find(p => p.id === id);
  },

  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }))
}))
