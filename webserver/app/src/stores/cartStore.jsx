import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      cartCount: 0,
      cartTotal: 0,

      addToCart: (product) =>
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
        }),

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
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
