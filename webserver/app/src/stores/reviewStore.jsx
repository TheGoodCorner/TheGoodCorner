// src/stores/reviewStore.jsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  fetchUserReviewsRequest,
  createReviewRequest,
  updateReviewRequest,
  deleteReviewRequest,
} from '../api/reviewApi';

export const useReviewStore = create(
  persist(
    (set, get) => ({
      reviews: [],
      loading: false,
      error: null,


      // GET /user/reviews — TOUS tes avis (privé).
      fetchUserReviews: async (id) => {
        set({ loading: true, error: null });
        try {
          const data = await fetchUserReviewsRequest(id);
          set({ reviews: data, loading: false });
          return data;
        } catch (err) {
          set({ error: err.message, loading: false });
          console.error('fetchUserReviews error:', err);
        }
      },

      // POST crée un nouvel avis. Ajoute l'avis créé au
      // tableau `reviews` immédiatement.
      createReview: async (id, reviewData) => {
        set({ loading: true, error: null });
        try {
          const newReview = await createReviewRequest(id, reviewData);
          set((state) => ({
            reviews: [...state.reviews, newReview],
            loading: false,
          }));
          return newReview;
        } catch (err) {
          set({ error: err.message, loading: false });
          console.error('createReview error:', err);
          throw err;
        }
      },

      // PUT met à jour l avis. L'id de l'avis est passé
      // explicitement, ne peut modifier que tes propres avis.
      updateReview: async (id, reviewId, updates) => {
        set({ loading: true, error: null });
        try {
          const updatedReview = await updateReviewRequest(id, reviewId, updates);
          set((state) => ({
            reviews: state.reviews.map((r) =>
              r.id === reviewId ? updatedReview : r
            ),
            loading: false,
          }));
          return updatedReview;
        } catch (err) {
          set({ error: err.message, loading: false });
          console.error('updateReview error:', err);
          throw err;
        }
      },

      // DELETE supprime l'avis
      deleteReview: async (id, reviewId) => {
        set({ loading: true, error: null });
        try {
          await deleteReviewRequest(id, reviewId);
          set((state) => ({
            reviews: state.reviews.filter((r) => r.id !== reviewId),
            loading: false,
          }));
        } catch (err) {
          set({ error: err.message, loading: false });
          console.error('deleteReview error:', err);
          throw err;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      logout: () => {
        set({
          reviews: [],
          error: null,
          loading: false,
        });
      },
    }),
    {
      name: 'review-store',
      partialize: (state) => ({
        reviews: state.reviews, // Persiste SEULEMENT tes propres avis
      }),
    }
  )
);
