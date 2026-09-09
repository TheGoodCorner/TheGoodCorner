import { io } from 'socket.io-client';
import { useMessageStore } from './stores/messageStore';
import { useNotificationStore } from './stores/notificationStore';
import { useUserStore } from './stores/userStore';
import { useProductStore } from './stores/productStore';
import { useFriendStore } from './stores/friendStore';

// const SOCKET_ORIGIN = ('https://localhost:4443/api').replace(/\/api\/?$/, '');

export const socket = io({
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket'],
});

let registeredUserId = null;

export function connectSocket(userId) {
  if (!userId)
    return;

  if (!socket.connected) {
    socket.connect();
  }
  if (registeredUserId !== userId) {
    socket.emit('register_user', userId);
    registeredUserId = userId;
  }
}

export function disconnectSocket() {
  registeredUserId = null;
  if (socket.connected)
    socket.disconnect();
}

socket.on('connect', () => {
  if (registeredUserId) {
    socket.emit('register_user', registeredUserId);
  }
});

// --- Messagerie ----
socket.on('receive_direct_message', (message) => {
  useMessageStore.getState().receiveMessage(message);
});

socket.on('message_updated', (message) => {
  useMessageStore.getState().handleMessageUpdated(message);
});

socket.on('message_deleted', (payload) => {
  useMessageStore.getState().handleMessageDeleted(payload);
});

socket.on('new_product', (product) => {
  useProductStore.getState().addProduct(product);
});

socket.on('product_sold', (payload) => {
  useNotificationStore.getState().addNotification({
    id: Date.now(),
    type: 'PRODUCT_SOLD',
    content: payload,
    read: false,
    createdAt: new Date().toISOString(),
  });
});

socket.on('review_deleted', ({ reviewId }) => {
  const notifs = useNotificationStore.getState().notifications;
  const toRemove = notifs.find((n) => n.type === 'REVIEW' && n.content?.reviewId === reviewId);
  if (toRemove) useNotificationStore.getState().removeNotification(toRemove.id);
  const { user, setUser } = useUserStore.getState();
  if (user) {
    setUser({
      ...user,
      sellerReviewCount: Math.max(0, (user.sellerReviewCount || 0) - 1),
      receivedReviews: (user.receivedReviews || []).filter((r) => r.id !== reviewId),
    });
  }
});

socket.on('new_review', (payload) => {
  useNotificationStore.getState().addNotification({
    id: payload.notifId,
    type: 'REVIEW',
    content: payload,
    read: false,
    createdAt: new Date().toISOString(),
  });
  const { user, setUser } = useUserStore.getState();
  if (user) {
    setUser({
      ...user,
      sellerReviewCount: (user.sellerReviewCount || 0) + 1,
      receivedReviews: [payload.review, ...(user.receivedReviews || [])],
    });
  }
});

// --- Notifications amis ---
socket.on('new_friend_request', (payload) => {
  useNotificationStore.getState().addNotification({
    id: payload.notifId,
    type: 'FRIEND_REQUEST',
    content: payload,
    read: false,
    createdAt: new Date().toISOString(),
  });
  useFriendStore.getState().fetchReceivedFriendRequests();
});

socket.on('friend_request_accepted', (payload) => {
  useNotificationStore.getState().addNotification({
    id: payload.notifId,
    type: 'FRIEND_ACCEPTED',
    content: payload,
    read: false,
    createdAt: new Date().toISOString(),
  });
  useFriendStore.getState().fetchFriends();
  useFriendStore.getState().fetchSentFriendRequests();
});

socket.on('friend_request_rejected', (payload) => {
  useNotificationStore.getState().addNotification({
    id: payload.notifId,
    type: 'FRIEND_REJECTED',
    content: payload,
    read: false,
    createdAt: new Date().toISOString(),
  });
  useFriendStore.getState().fetchSentFriendRequests();
});

socket.on('friend_removed', () => {
  useFriendStore.getState().fetchFriends();
  useFriendStore.getState().fetchSentFriendRequests();
  useFriendStore.getState().fetchReceivedFriendRequests();
});

// --- Statut en ligne (amis) ---
socket.on('online_users_list', (userIds) => {
  useFriendStore.getState().setOnlineUsers(userIds);
});

socket.on('user_online', ({ userId }) => {
  useFriendStore.getState().setUserOnline(userId);
});

socket.on('user_offline', ({ userId }) => {
  useFriendStore.getState().setUserOffline(userId);
});
