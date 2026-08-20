import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useUserStore } from './userStore' 

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      cartCount: 0,
      cartTotal: 0,
      error: null,
      

      addToCart: (product) => {

        if (!product || !product.id || !product.price) {
          set({ error: 'Produit invalide.' })
          return false
        }
        const currentUser = useUserStore.getState().user        
        // Vérifier si c'est le propre produit de l'utilisateur
        if (product.authorId === currentUser?.id) {
          set({ error: 'Vous ne pouvez pas ajouter votre propre produit au panier.' })
          return false
        }

        set({ error: null })

        set((state) => {
          const existing = state.cartItems.find((item) => item.id === product.id)
          let newItems

          if (existing) {
            newItems = state.cartItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + (product.quantity || 1) }
                : item
            )
          } else {
            newItems = [...state.cartItems, { ...product, quantity: product.quantity || 1 }]
          }

          return {
            cartItems: newItems,
            cartCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
            cartTotal: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          }
        })
        return true
      },

      removeFromCart: (productId) =>
        set((state) => {
          const newItems = state.cartItems.filter((item) => item.id !== productId)
          return {
            cartItems: newItems,
            cartCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
            cartTotal: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          }
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          const newItems = state.cartItems.map((item) =>
            item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
          )
          return {
            cartItems: newItems,
            cartCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
            cartTotal: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          }
        }),

      clearCart: () =>
        set({
          cartItems: [],
          cartCount: 0,
          cartTotal: 0,
        }),
      
      setError: (error) => set({ error }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
