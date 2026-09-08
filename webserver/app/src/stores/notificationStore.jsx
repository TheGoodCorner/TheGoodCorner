import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useNotificationStore = create(
  persist(
    (set) => ({
      reviewNotifications: [],

      addReviewNotification: (notification) => {
        set((state) => ({
          reviewNotifications: [{ ...notification, id: Date.now(), read: false }, ...state.reviewNotifications],
        }));
      },

      markAllRead: () => {
        set((state) => ({
          reviewNotifications: state.reviewNotifications.map((n) => ({ ...n, read: true })),
        }));
      },

      reset: () => set({ reviewNotifications: [] }),
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
