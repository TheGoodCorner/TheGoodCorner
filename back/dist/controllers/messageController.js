import { MessageService } from "../services/messages/messageUtils.js";
const messageController = {
    fetchConversation: async (req, res) => {
        try {
            const currentUserId = req.user.id;
            const recipientUserId = Number(req.params.recipientId);
            if (!currentUserId)
                return res.status(400).json({ error: 'Missing currentUserId' });
            if (isNaN(recipientUserId) || recipientUserId <= 0)
                return res.status(400).json({ status: 'ERROR', message: 'Valid recipient ID is required' });
            if (currentUserId === recipientUserId)
                return res.status(400).json({ status: 'ERROR', message: 'Cannot fetch conversation with yourself' });
            const messages = await MessageService.getConversation(currentUserId, recipientUserId, 50);
            console.log('Messages successfully fetched');
            return (res.status(200).json({ message: 'Messages successfully fetched', data: messages }));
        }
        catch (error) {
            console.log(' an error occured inside fetch conversation');
            return (res.status(500).json({ status: 'ERROR', message: 'Internal server error' }));
        }
    },
    sendMessage: async (req, res) => {
        try {
            const currentUserId = req.user.id;
            const recipientUserId = Number(req.params.recipientId);
            const { content } = req.body;
            if (!currentUserId)
                return res.status(401).json({ status: 'ERROR', message: 'Unauthorized' });
            if (isNaN(recipientUserId) || recipientUserId <= 0)
                return res.status(400).json({ status: 'ERROR', message: 'Valid recipient ID is required' });
            if (currentUserId === recipientUserId)
                return res.status(400).json({ status: 'ERROR', message: 'You cannot send a message to yourself' });
            if (!content || typeof content !== 'string' || !content.trim())
                return res.status(400).json({ status: 'ERROR', message: 'Message content cannot be empty' });
            const savedMsg = await MessageService.saveMessage(currentUserId, recipientUserId, content.trim());
            const io = req.app.get('io');
            if (io)
                io.to(`user_${recipientUserId}`).emit('receive_direct_message', savedMsg);
            console.log('Messages successfully sent');
            return res.status(201).json({ data: savedMsg });
        }
        catch (error) {
            console.log(' an error occured inside send message');
            return (res.status(500).json({ status: 'ERROR', message: 'Internal server error' }));
        }
    },
    updateMessage: async (_req, _res) => {
        ;
    },
    deleteMessage: async (_req, _res) => {
        ;
    }
};
export default messageController;
