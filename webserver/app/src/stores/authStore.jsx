import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      // État
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Actions
      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const mockUser = { id: 1, email, username: 'user', avatar: '👤' }
          const mockToken = 'mock_jwt_token_' + Math.random().toString(36).substr(2, 9)
          set({ 
            user: mockUser, 
            token: mockToken,
            isAuthenticated: true, 
            loading: false 
          })
        } catch (err) {
          set({ error: err.message, loading: false })
        }
      },

      register: async (email, password, username) => {
        set({ loading: true, error: null })
        try {
          const mockUser = { id: 1, email, username, avatar: '👤' }
          const mockToken = 'mock_jwt_token_' + Math.random().toString(36).substr(2, 9)
          set({ 
            user: mockUser, 
            token: mockToken,
            isAuthenticated: true, 
            loading: false 
          })
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
    }
  )
)
