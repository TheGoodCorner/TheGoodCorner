import { io } from 'socket.io-client';
import { useMessageStore } from './stores/messageStore';

const SOCKET_ORIGIN = (process.env.REACT_APP_API_URL || 'https://localhost:3000/api').replace(/\/api\/?$/, '');

console.log('🔌 SOCKET_ORIGIN:', SOCKET_ORIGIN); // ✅ À vérifier

export const socket = io(SOCKET_ORIGIN, {
  autoConnect: false,
  withCredentials: true,
});

let registeredUserId = null;

export function connectSocket(userId) {
  console.log('🚀 connectSocket appelé avec userId:', userId); // ✅
  if (!userId) return;
  if (!socket.connected) {
    console.log('📡 Connexion au socket...'); // ✅
    socket.connect();
  }
  if (registeredUserId !== userId) {
    console.log('📝 Émission register_user:', userId); // ✅
    socket.emit('register_user', userId);
    registeredUserId = userId;
  }
}

export function disconnectSocket() {
  console.log('❌ Déconnexion socket'); // ✅
  registeredUserId = null;
  if (socket.connected) socket.disconnect();
}

socket.on('connect', () => {
  console.log('✅ Socket connecté, id:', socket.id); // ✅
  if (registeredUserId) {
    console.log('🔄 Re-register après reconnexion:', registeredUserId); // ✅
    socket.emit('register_user', registeredUserId);
  }
});

socket.on('receive_direct_message', (message) => {
  console.log('📨 Message reçu:', message); // ✅ Déjà là
  useMessageStore.getState().receiveMessage(message);
});
socket.on('message_updated', (message) => {
  console.log('✏️ Message mis à jour:', message); // ✅
  useMessageStore.getState().handleMessageUpdated(message);
});
socket.on('message_deleted', (payload) => {
  console.log('🗑️ Message supprimé:', payload); // ✅
  useMessageStore.getState().handleMessageDeleted(payload);
});
