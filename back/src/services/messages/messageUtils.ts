import prisma from '../db.js';

export class MessageService {
  static async saveMessage(senderId: number, receiverId: number, content: string) {
	return await prisma.message.create({
	  data: {
		senderId,
		receiverId,
		content
	  },
	  include: {
		sender: { select: { id: true, username: true, email: true } },
		receiver: { select: { id: true, username: true, email: true } }
	  }
	});
  }

  static async getConversation(user1Id: number, user2Id: number, limit: number) {
	return await prisma.message.findMany({
	  where: {
		OR: [
		  { senderId: user1Id, receiverId: user2Id },
		  { senderId: user2Id, receiverId: user1Id }
		]
	  },
	  orderBy: { createdAt: 'asc' }, // a voir si on met desc
	  take: limit,
	  include: {
		sender: { select: { id: true, name: true } }
	  }
	});
  }
}