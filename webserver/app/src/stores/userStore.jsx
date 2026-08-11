// src/stores/userStore.jsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchUserRequest, updateUserRequest } from '../api/userApi';

export const useUserStore = create(
  persist(
    (set) => ({
      // ====== STATE ======
      user: null,           // { id, name, email, addresses, preferences, ... }
      loading: false,
      error: null,

      // ====== ACTIONS ======

      // Charger les données utilisateur (token géré par l'intercepteur)
      fetchUser: async () => {
        set({ loading: true, error: null });
        try {
          const data = await fetchUserRequest();
          set({ user: data, error: null });
        } catch (err) {
          set({ 
            error: err.message,
            user: null,
          });
          console.error('fetchUser error:', err);
        } finally {
          set({ loading: false });
        }
      },

      // Mettre à jour le profil utilisateur
      updateProfile: async (updates) => {
        set({ loading: true, error: null });
        try {
          const data = await updateUserRequest(updates);
          set({ user: data, error: null });
          return data;
        } catch (err) {
          set({ error: err.message });
          console.error('updateProfile error:', err);
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      // Vider les données utilisateur (logout)
      logout: () => {
        set({ user: null, error: null, loading: false });
      },

      // Réinitialiser l'erreur
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'user-store', // Clé localStorage
      partialize: (state) => ({
        user: state.user, // Persiste SEULEMENT le user
      }),
    }
  )
);
