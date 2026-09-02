import { create } from 'zustand';
import {
  sendFriendRequestRequest,
  acceptFriendRequestRequest,
  rejectFriendRequestRequest,
  deleteFriendRequestRequest,
} from '../api/friendApi';
import { useUserStore } from './userStore';

export const useFriendStore = create((set) => ({
  submitting: false,
  actionLoadingId: null, // ✅ Nouveau : track l'action en cours
  error: null,

  sendFriendRequest: async (receiverId) => {
    set({ actionLoadingId: `send-${receiverId}`, error: null });
    try {
      const newRequest = await sendFriendRequestRequest(receiverId);
      set({ actionLoadingId: null });
      useUserStore.getState().fetchPendingFriendRequests();
      return newRequest;
    } catch (err) {
      set({ error: err.message, actionLoadingId: null });
      console.error('sendFriendRequest error:', err);
      throw err;
    }
  },

  acceptRequest: async (id) => { // ✅ Renommé pour matcher le composant
    set({ actionLoadingId: id, error: null });
    try {
      const accepted = await acceptFriendRequestRequest(id);
      set({ actionLoadingId: null });
      useUserStore.getState().fetchPendingFriendRequests();
      useUserStore.getState().fetchFriends();
      return accepted;
    } catch (err) {
      set({ error: err.message, actionLoadingId: null });
      console.error('acceptRequest error:', err);
      throw err;
    }
  },

  rejectRequest: async (id) => { // ✅ Renommé pour matcher le composant
    set({ actionLoadingId: id, error: null });
    try {
      const rejected = await rejectFriendRequestRequest(id);
      set({ actionLoadingId: null });
      useUserStore.getState().fetchPendingFriendRequests();
      return rejected;
    } catch (err) {
      set({ error: err.message, actionLoadingId: null });
      console.error('rejectRequest error:', err);
      throw err;
    }
  },

  cancelOrRemove: async (requestId, options = {}) => { // ✅ Nouveau : gère annulation et suppression
    set({ actionLoadingId: requestId, error: null });
    try {
      await deleteFriendRequestRequest(requestId);
      set({ actionLoadingId: null });
      useUserStore.getState().fetchPendingFriendRequests();
      useUserStore.getState().fetchFriends();
    } catch (err) {
      set({ error: err.message, actionLoadingId: null });
      console.error('cancelOrRemove error:', err);
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

// ✅ Hook pour déterminer le statut de l'amitié avec un userId
export function useFriendshipStatus(userId) {
  const user = useUserStore((state) => state.user);
  const friendRequests = useUserStore((state) => state.friendRequests);
  const friends = useUserStore((state) => state.friends);

  // Cherche une demande reçue
  const receivedRequest = friendRequests?.find(
    (req) => String(req.senderId) === String(userId)
  );

  // Cherche une demande envoyée
  const sentRequest = user?.friendRequestsSent?.find(
    (req) => String(req.receiverId) === String(userId)
  );

  // Cherche un ami
  const friend = friends?.find((f) => String(f.id) === String(userId));

  if (friend) {
    return { status: 'friends', friend };
  }

  if (receivedRequest) {
    return { status: 'received', request: receivedRequest };
  }

  if (sentRequest) {
    return { status: 'sent', request: sentRequest };
  }

  return { status: 'none', request: null, friend: null };
}
