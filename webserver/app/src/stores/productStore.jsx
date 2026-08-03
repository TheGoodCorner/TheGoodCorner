import { create } from 'zustand'

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 1000,
  },

  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  resetFilters: () =>
    set({
      filters: {
        search: '',
        category: '',
        minPrice: 0,
        maxPrice: 1000,
      },
    }),

  getFilteredProducts: () => {
    const { products, filters } = get()
    return products.filter((product) => {
      const matchSearch =
        product.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description?.toLowerCase().includes(filters.search.toLowerCase())
      const matchCategory = !filters.category || product.category === filters.category
      const matchPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice

      return matchSearch && matchCategory && matchPrice
    })
  },
}))
