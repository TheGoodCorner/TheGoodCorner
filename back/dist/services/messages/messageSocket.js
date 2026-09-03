import { Server } from 'socket.io';
import { MessageService } from './messageUtils.js';
export function initializeWebServer(server) {
    const io = new Server(server, {
        cors: {
            origin: 'https://localhost:4443',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });
    // console.log('🔌 Socket.io initialisé'); // ✅
    io.on('connection', (socket) => {
        // console.log('✅ Nouveau client connecté:', socket.id); // ✅
        socket.on('register_user', (userId) => {
            // console.log(`📝 register_user reçu: socket ${socket.id} → user_${userId}`); // ✅
            socket.join(`user_${userId}`);
            // console.log(`✅ Socket ${socket.id} registered for user_${userId}`);
        });
        socket.on('send_direct_message', async (data) => {
            // console.log('📨 send_direct_message reçu:', data); // ✅
            try {
                // console.log(`💾 Sauvegarde du message de ${data.senderId} à ${data.receiverId}...`); // ✅
                const savedMessage = await MessageService.saveMessage(data.senderId, data.receiverId, data.content);
                // console.log('✅ Message sauvegardé:', savedMessage); // ✅
                // console.log(`📤 Émission à user_${data.receiverId}`); // ✅
                io.to(`user_${data.receiverId}`).emit('receive_direct_message', savedMessage);
                // console.log('✅ Émission terminée'); // ✅
                // 🔄 Envoie AUSSI au SENDER (c'est important!)
                // console.log(`📤 Émission à user_${data.senderId} (sender)`);
                io.to(`user_${data.senderId}`).emit('receive_direct_message', savedMessage);
            }
            catch (error) {
                // console.error('❌ Erreur lors du traitement du message:', error); // ✅
                socket.emit('error', { message: 'Failed to send message' });
            }
        });
        socket.on('disconnect', () => {
            // console.log(`❌ Déconnexion socketId : ${socket.id}`)
        });
    });
    return (io);
}
