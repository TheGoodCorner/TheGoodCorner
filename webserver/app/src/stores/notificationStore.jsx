import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { fetchNotificationsRequest, markNotificationReadRequest, markAllNotificationsReadRequest, deleteNotificationRequest } from '../api/notificationApi';

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      notificationsEnabled: true,

      toggleNotifications: () =>
        set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),

      setNotificationsEnabled: (enabled) =>
        set({ notificationsEnabled: enabled }),

      fetchNotifications: async () => {
        try {
          const data = await fetchNotificationsRequest();
          set({ notifications: data });
        } catch (error) {
          console.error('fetchNotifications error:', error);
        }
      },

      addNotification: (notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
        }));
      },

      removeNotification: (notifId) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== notifId),
        }));
      },

      markAsRead: async (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
        }));
        try {
          await markNotificationReadRequest(id);
        } catch (error) {
          console.error('markAsRead error:', error);
        }
      },

      markAllRead: async () => {
        try {
          await markAllNotificationsReadRequest();
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
          }));
        } catch (error) {
          console.error('markAllRead error:', error);
        }
      },

      reset: () => set({ notifications: [] }),
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ notificationsEnabled: state.notificationsEnabled }),
    }
  )
);