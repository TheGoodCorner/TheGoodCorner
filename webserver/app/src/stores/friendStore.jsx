import { create } from 'zustand';
import {
  sendFriendRequestRequest,
  acceptFriendRequestRequest,
  rejectFriendRequestRequest,
  deleteFriendRequestRequest,
  fetchFriendsRequest,
  fetchPendingFriendRequestsRequest,
} from '../api/friendpApi';
import { useUserStore } from './userStore';

// Ce store ne garde pas de liste d'amis/demandes en mémoire.
// Les données viennent du userStore (currentUser.friends, currentUser.friendRequests).
// Ce store déclenche les actions d'écriture et rafraîchit les données après.
export const useFriendshipStore = create((set) => ({
  submitting: false,
  error: null,

  sendFriendRequest: async (receiverId) => {
    set({ submitting: true, error: null });
    try {
      const newRequest = await sendFriendRequestRequest(receiverId);
      set({ submitting: false });
      useUserStore.getState().fetchPendingFriendRequests();
      return newRequest;
    } catch (err) {
      set({ error: err.message, submitting: false });
      console.error('sendFriendRequest error:', err);
      throw err;
    }
  },

  acceptFriendRequest: async (id) => {
    set({ submitting: true, error: null });
    try {
      const accepted = await acceptFriendRequestRequest(id);
      set({ submitting: false });
      useUserStore.getState().fetchPendingFriendRequests();
      useUserStore.getState().fetchFriends();
      return accepted;
    } catch (err) {
      set({ error: err.message, submitting: false });
      console.error('acceptFriendRequest error:', err);
      throw err;
    }
  },

  rejectFriendRequest: async (id) => {
    set({ submitting: true, error: null });
    try {
      const rejected = await rejectFriendRequestRequest(id);
      set({ submitting: false });
      useUserStore.getState().fetchPendingFriendRequests();
      return rejected;
    } catch (err) {
      set({ error: err.message, submitting: false });
      console.error('rejectFriendRequest error:', err);
      throw err;
    }
  },

  deleteFriendRequest: async (id) => {
    set({ submitting: true, error: null });
    try {
      await deleteFriendRequestRequest(id);
      set({ submitting: false });
      useUserStore.getState().fetchPendingFriendRequests();
      useUserStore.getState().fetchFriends();
    } catch (err) {
      set({ error: err.message, submitting: false });
      console.error('deleteFriendRequest error:', err);
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
