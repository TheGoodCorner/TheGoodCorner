import { Server as HttpServer, METHODS } from 'http';
import { Server, Socket } from 'socket.io';
import { MessageService } from './messageUtils.js';

export function initializeWebServer(server: HttpServer) {
	const io = new Server(server, {
		cors: {
			origin: 'https://localhost:4443',
			methods: ['GET', 'POST'],
			credentials: true
		}
	})
	io.on('connection', (socket: Socket) => {
		socket.on('register_user', (userId: Number) => {
			socket.join(`user_${userId}`);
			console.log(`Socket ${socket.id} registered for user_${userId}`);
		})
		socket.on('send_direct_message', async (data: { senderId: number, receiverId: number, content: string }) => {
			try {
				const savedMessage = await MessageService.saveMessage(
					data.senderId,
					data.receiverId,
					data.content
				)
				io.to(`user_${data.receiverId}`).emit('receive_direct_message', savedMessage);
				socket.emit('message_sent', savedMessage);
			}
			catch (error) {
				console.error('Failed to process message in messageSocket');
				socket.emit('error', { message: 'Failed to send message' });
			}
		});
		socket.on('disconnect', () => {
			console.log(`Successfully disconnected socketId : ${socket.id}`)
		});
	})
	return (io);
}