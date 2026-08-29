import { create } from 'zustand'
import { loginRequest, registerRequest, refreshRequest, logoutRequest } from '../api/authApi'
import { useCartStore } from './cartStore'
import { useUserStore } from './userStore'
import { useMessageStore } from './messageStore'
import { connectSocket, disconnectSocket } from '../socket'

const SESSION_KEY = 'has_session';
const hasInitialSession = typeof window !== 'undefined' && localStorage.getItem(SESSION_KEY) === 'true';
// Ne gère que l'authentification (token, statut) — l'identité de la
// personne (profil) vit exclusivement dans userStore, pour n'avoir qu'une
// seule source de vérité. Voir userStore.setUser(), alimenté ici juste
// après login/register/refresh.
export const useAuthStore = create((set) => ({
  token: null,
  isAuthenticated: false,
  initializing: hasInitialSession,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { user, token } = await loginRequest(email, password)
	  localStorage.setItem(SESSION_KEY, 'true')
      set({token, isAuthenticated: true, loading: false })
      // login renvoie déjà le profil complet : on le pousse directement
      // dans userStore, pas de fetch séparé (GET /user/:id est publique et
      // ne renverrait que la version publique).
      useUserStore.getState().setUser(user)
      connectSocket(user.id)
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
	  localStorage.setItem(SESSION_KEY, 'true')
      set({token, isAuthenticated: true, loading: false })
      useUserStore.getState().setUser(user)
      connectSocket(user.id)
      return true
    } catch (err) {
      set({ error: err.message, loading: false })
      return false
    }
  },

  initAuth: async () => {
	const hasSession = localStorage.getItem(SESSION_KEY) === 'true'
    if (!hasSession) {
      set({ token: null, isAuthenticated: false, initializing: false })
      return
	}
    try {
      const { user, token } = await refreshRequest()
      set({token, isAuthenticated: true, initializing: false })
      useUserStore.getState().setUser(user)
      connectSocket(user.id)
    } catch {
      set({ user: null, token: null, isAuthenticated: false, initializing: false })
    }
  },

  logout: async () => {
    // Même si l'appel échoue, on déconnecte quand même côté client.
    localStorage.removeItem(SESSION_KEY)
    set({ user: null, token: null, isAuthenticated: false, error: null })
    useCartStore.getState().clearCart()
    useUserStore.getState().logout()
    useMessageStore.getState().reset()
    disconnectSocket()
    try {
      await logoutRequest()
    } catch {
      // best-effort : côté client la session est déjà terminée
    }
  },

  setToken: (token) => set({ token }),
  setError: (error) => set({ error }),
}))