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
      // Tous les avis QUE TU AS ÉCRITS (privé, complet) — rempli par
      // fetchUserReviews() pour récupérer tous tes avis, ou mis à jour
      // après créer/modifier/supprimer.
      reviews: [],
      loading: false,
      error: null,


      // GET /user/reviews — TOUS tes avis (privé). L'id vient du user
      // connecté (depuis authStore ou userStore).
      fetchUserReviews: async (userId) => {
        set({ loading: true, error: null });
        try {
          const data = await fetchUserReviewsRequest(userId);
          set({ reviews: data, loading: false });
          return data;
        } catch (err) {
          set({ error: err.message, loading: false });
          console.error('fetchUserReviews error:', err);
        }
      },

      // POST /reviews — crée un nouvel avis. Ajoute l'avis créé à ton
      // tableau `reviews` immédiatement.
      createReview: async (productId, reviewData) => {
        set({ loading: true, error: null });
        try {
          const newReview = await createReviewRequest(productId, reviewData);
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

      // PUT /reviews/:id — met à jour ton avis. L'id de l'avis est passé
      // explicitement ; ne peut modifier que tes propres avis.
      updateReview: async (reviewId, updates) => {
        set({ loading: true, error: null });
        try {
          const updatedReview = await updateReviewRequest(reviewId, updates);
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

      // DELETE /reviews/:id — supprime ton avis.
      deleteReview: async (reviewId) => {
        set({ loading: true, error: null });
        try {
          await deleteReviewRequest(reviewId);
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
        set({ error: null, productReviewsError: null });
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
