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
          set({ error: {message: 'Vous ne pouvez pas ajouter votre propre produit au panier.',  productId: product.id} })
          return false
        }
		const maxStock = Number(product.stock ?? product.quantity) || 0;
        const addCount = Number(product.quantity) || 1;
      
        const state = get(); // Récupère l'état actuel
        const existing = state.cartItems.find((item) => item.id === product.id);
        const currentCount = existing ? existing.quantity : 0;
      
        // 1. Bloquer si la quantité cumulée dépasse le stock disponible
        if (currentCount + addCount > maxStock) {
          set({
            error: {message: `Stock insuffisant : vous avez déjà ${currentCount} article(s) dans le panier pour un stock de ${maxStock}.`, productId: product.id}
          });
          return false;
        }

        set((prevState) => {
          const existing = prevState.cartItems.find((item) => item.id === product.id)
          let newItems

          if (existing) {
            newItems = prevState.cartItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + (product.quantity || 1) }
                : item
            )
          } else {
            newItems = [...prevState.cartItems, { ...product, quantity: product.quantity || 1 }]
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
      clearError: () => set({ error: null }),

    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cartItems: state.cartItems,
        cartCount: state.cartCount,
        cartTotal: state.cartTotal,
      }),
    }
  )
)
