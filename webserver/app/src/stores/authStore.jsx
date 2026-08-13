import { create } from 'zustand'
import { loginRequest, registerRequest, refreshRequest, logoutRequest } from '../api/authApi'
import { useCartStore } from './cartStore'
import { useUserStore } from './userStore'

// Ne gère que l'authentification (token, statut) — l'identité de la
// personne (profil) vit exclusivement dans userStore, pour n'avoir qu'une
// seule source de vérité. Voir userStore.setUser(), alimenté ici juste
// après login/register/refresh.
export const useAuthStore = create((set) => ({
  token: null,
  isAuthenticated: false,
  initializing: true,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { user, token } = await loginRequest(email, password)
      set({token, isAuthenticated: true, loading: false })
      // login renvoie déjà le profil complet : on le pousse directement
      // dans userStore, pas de fetch séparé (GET /user/:id est publique et
      // ne renverrait que la version publique).
      useUserStore.getState().setUser(user)
      return true
    } catch (err) {
      set({ error: err.message, loading: false })
      return false
    }
  },

  register: async (email, password, username) => {
    set({ loading: true, error: null })
    try {
      const { user, token } = await registerRequest(email, password, username)
      set({token, isAuthenticated: true, loading: false })
      useUserStore.getState().setUser(user)
      return true
    } catch (err) {
      set({ error: err.message, loading: false })
      return false
    }
  },

  initAuth: async () => {
    try {
      const { user, token } = await refreshRequest()
      set({token, isAuthenticated: true, initializing: false })
      useUserStore.getState().setUser(user)
    } catch {
      set({ user: null, token: null, isAuthenticated: false, initializing: false })
    }
  },

  logout: async () => {
    try {
      await logoutRequest()
    } catch {
      // Même si l'appel échoue, on déconnecte quand même côté client.
    }
    set({ user: null, token: null, isAuthenticated: false, error: null })
    useCartStore.getState().clearCart()
    useUserStore.getState().logout()
  },

  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  setError: (error) => set({ error }),
}))