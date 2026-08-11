import { create } from 'zustand'
import { loginRequest, registerRequest, refreshRequest, logoutRequest } from '../api/authApi'
import { useCartStore } from './cartStore'

// Plus de `persist` ici, volontairement : l'access token ne doit jamais être
// écrit sur disque (localStorage/sessionStorage), même chiffré. Il vit
// uniquement en mémoire JS, donc disparaît à chaque refresh de page — c'est
// `initAuth` qui restaure la session via le cookie refresh httpOnly (que ce
// store ne voit et ne touche jamais directement).
export const useAuthStore = create((set) => ({
  // État
  user: null,
  token: null,
  isAuthenticated: false,
  initializing: true, // true pendant la tentative de reconnexion silencieuse au démarrage
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { user, token } = await loginRequest(email, password)
      set({ user, token, isAuthenticated: true, loading: false })
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
      set({ user, token, isAuthenticated: true, loading: false })
      return true
    } catch (err) {
      set({ error: err.message, loading: false })
      return false
    }
  },

  // Appelé une seule fois au montage de App.jsx. Le cookie refresh httpOnly
  // part automatiquement avec la requête : si la session est encore valide,
  // l'utilisateur est reconnecté sans avoir rien à faire, alors même
  // qu'aucun token n'a jamais été stocké côté client.
  initAuth: async () => {
    try {
      const { user, token } = await refreshRequest()
      set({ user, token, isAuthenticated: true, initializing: false })
    } catch {
      set({ user: null, token: null, isAuthenticated: false, initializing: false })
    }
  },

  logout: async () => {
    try {
      await logoutRequest()
    } catch {
      // Même si l'appel échoue (backend down, réseau...), on déconnecte
      // quand même côté client — pas la peine de bloquer l'utilisateur.
    }
    set({ user: null, token: null, isAuthenticated: false, error: null })
    //cartStore n'est pas (encore) scopé par utilisateur côté
    // backend, donc on le vide explicitement ici. À terme, le panier
    // "utilisateur" viendra du serveur et ce clearCart() disparaîtra au
    // profit d'un simple refetch.
    useCartStore.getState().clearCart()
  },

  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  setError: (error) => set({ error }),
}))
