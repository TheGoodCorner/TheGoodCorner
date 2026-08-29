import { io } from 'socket.io-client';
import { useMessageStore } from './stores/messageStore';

const SOCKET_ORIGIN = (process.env.REACT_APP_API_URL || 'https://localhost:3000/api').replace(/\/api\/?$/, '');

export const socket = io(SOCKET_ORIGIN, {
  autoConnect: false,
  withCredentials: true,
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
  if (socket.connected) socket.disconnect();
}

socket.on('connect', () => {
  if (registeredUserId) {
    socket.emit('register_user', registeredUserId);
  }
});

socket.on('receive_direct_message', (message) => {
  useMessageStore.getState().receiveMessage(message);
});

socket.on('message_updated', (message) => {
  useMessageStore.getState().handleMessageUpdated(message);
});

socket.on('message_deleted', (payload) => {
  useMessageStore.getState().handleMessageDeleted(payload);
});
