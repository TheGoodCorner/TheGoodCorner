import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { loginRequest, registerRequest, validateTokenRequest } from '../api/authApi'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // État
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      initAuth: async () => {
        const { token } = get()
        if (!token) return // Pas loggé
        
        set({ loading: true })
        try {
          const { user } = await validateTokenRequest(token)
          set({ user, isAuthenticated: true, loading: false })
        } catch (err) {
          // Token expiré/invalide → déloguer
          set({ user: null, token: null, isAuthenticated: false, loading: false })
        }
      },

      // Actions
      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const { user, token } = await loginRequest(email, password)
          set({ user, token, isAuthenticated: true, loading: false })
        } catch (err) {
          set({ error: err.message, loading: false })
        }
      },

      register: async (email, password, username) => {
        set({ loading: true, error: null })
        try {
          const { user, token } = await registerRequest(email, password, username)
          set({ user, token, isAuthenticated: true, loading: false })
        } catch (err) {
          set({ error: err.message, loading: false })
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null })
      },

      setUser: (user) => set({ user }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Ne persiste que l'identité de session, jamais error/loading.
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
