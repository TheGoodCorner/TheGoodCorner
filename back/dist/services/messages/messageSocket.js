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
    io.on('connection', (socket) => {
        socket.on('register_user', (userId) => {
            socket.join(`user_${userId}`);
            console.log(`Socket ${socket.id} registered for user_${userId}`);
        });
        socket.on('send_direct_message', async (data) => {
            try {
                const savedMessage = await MessageService.saveMessage(data.senderId, data.receiverId, data.content);
                io.to(`user_${data.receiverId}`).emit('receive_direct_message', savedMessage);
                socket.emit('message_sent', savedMessage);
            }
            catch (error) {
                console.error('Failed to process message in messageSocket');
                socket.emit('error', { message: 'Failed to send message' });
            }
        });
        socket.on('disconnect', () => {
            console.log(`Successfully disconnected socketId : ${socket.id}`);
        });
    });
    return (io);
}
