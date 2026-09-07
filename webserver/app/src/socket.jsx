import { io } from 'socket.io-client';
import { useMessageStore } from './stores/messageStore';
import { useFriendStore } from './stores/friendStore';

const SOCKET_ORIGIN = ('https://localhost:4443/api').replace(/\/api\/?$/, '');

export const socket = io(SOCKET_ORIGIN, {
  autoConnect: false,
  withCredentials: true,
});

let registeredUserId = null;

export function connectSocket(userId) {
  if (!userId)
    return;
  
  registeredUserId = userId;

  if (socket.connected || socket.disconnected) {
    socket.disconnect();
  }
  setTimeout(() => {
    socket.connect();
  }, 100);
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