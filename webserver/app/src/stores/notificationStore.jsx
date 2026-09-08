import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useNotificationStore = create(
  persist(
    (set) => ({
      reviewNotifications: [],
      friendNotifications: [],
      notificationsEnabled: true,

      toggleNotifications: () =>
        set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),

      setNotificationsEnabled: (enabled) =>
        set({ notificationsEnabled: enabled }),

      addReviewNotification: (notification) => {
        set((state) => ({
          reviewNotifications: [
            { ...notification, id: Date.now(), read: false },
            ...state.reviewNotifications,
          ],
        }));
      },

      addFriendNotification: (notification) => {
        set((state) => ({
          friendNotifications: [
            { ...notification, id: Date.now(), read: false },
            ...state.friendNotifications,
          ],
        }));
      },

      markAllRead: () => {
        set((state) => ({
          reviewNotifications: state.reviewNotifications.map((n) => ({ ...n, read: true })),
          friendNotifications: state.friendNotifications.map((n) => ({ ...n, read: true })),
        }));
      },

      reset: () => set({ reviewNotifications: [], friendNotifications: [] }),
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);