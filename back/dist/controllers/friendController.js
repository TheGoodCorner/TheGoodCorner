import prisma from "../services/db.js";
const friendController = {
    sendFriendRequest: async (req, res) => {
        try {
            const receiverId = req.body;
            const senderId = req.user.id;
            if (!receiverId)
                return res.status(400).json({ error: 'Invalid receiver ID' });
            if (receiverId === senderId)
                return res.status(400).json({ error: 'You cannot send a friend request to yourself' });
            const friendRequest = await prisma.friendRequest.create({
                data: {
                    senderId,
                    receiverId,
                },
            });
            console.log(`A friend request has been sucessfully sent to ${receiverId}`);
            return (res.status(201).json({ message: `sucessfully sent friend request`, data: friendRequest }));
        }
        catch (error) {
            console.error(error);
            return (res.status(400).json({ error: error instanceof Error ? error.message : 'Error creating friend request' }));
        }
    },
    getFriendRequests: async (req, res) => {
        try {
            const userId = req.user.id;
            const { type } = req.query;
            let where = {};
            let include = { sender: { select: { id: true, username: true, avatar: true } }, receiver: { select: { id: true, username: true, avatar: true } } };
            if (type === 'received') {
                where = { receiverId: userId };
            }
            else if (type === 'sent') {
                where = { senderId: userId };
            }
            else {
                where = {
                    OR: [{ senderId: userId }, { receiverId: userId }],
                };
            }
            // no need to check for null here on findMany
            const requests = await prisma.friendRequest.findMany({
                where,
                include,
            });
            console.log(`all friends request have been retrieved sucessfully`);
            return (res.status(200).json({ message: 'sucess on retrieving friends requests', data: requests }));
        }
        catch (error) {
            console.error(error);
            return (res.status(500).json({ error: 'Error fetching friend requests' }));
        }
    },
    acceptFriendRequest: async (req, res) => {
        try {
            const id = req.params;
            const userId = req.user.id;
            if (!id || !userId)
                return res.status(400).json({ error: 'Invalid route ID or invalid userId' });
            const request = await prisma.friendRequest.findUnique({
                where: { id: parseInt(String(id)) },
            });
            if (!request)
                return res.status(400).json({ error: 'friend request not found' });
            if (request.receiverId !== userId)
                return res.status(403).json({ error: 'Not authorized' });
            const updated = await prisma.friendRequest.update({
                where: { id: parseInt(String(id)) },
                data: { status: 'ACCEPTED' },
            });
            console.log(`A friend request has been accepted by ${userId}`);
            return (res.status(200).json({ message: '', data: updated }));
        }
        catch (error) {
            console.error(error);
            return (res.status(500).json({ error: 'Error accepting friend request' }));
        }
    },
    rejectFriendRequest: async (req, res) => {
        try {
            const id = req.params;
            const userId = req.user.id;
            if (!id || !userId)
                return res.status(400).json({ error: 'Invalid route ID or invalid userId' });
            const request = await prisma.friendRequest.findUnique({
                where: { id: parseInt(String(id)) },
            });
            if (!request)
                return res.status(400).json({ error: 'friend request not found' });
            if (request.receiverId !== userId)
                return res.status(403).json({ error: 'Not authorized' });
            const updated = await prisma.friendRequest.update({
                where: { id: parseInt(String(id)) },
                data: { status: 'REJECTED' },
            });
            console.log(`A friend request has been rejected by ${userId}`);
            return (res.status(200).json({ message: `a friend request has been rejected by ${userId}`, data: updated }));
        }
        catch (error) {
            console.error(error);
            return (res.status(500).json({ error: 'Error rejecting friend request' }));
        }
    },
    deleteFriendRequest: async (req, res) => {
        try {
            const id = req.params;
            const userId = req.user.id;
            if (!id || !userId)
                return res.status(400).json({ error: 'Invalid route ID or invalid userId' });
            const request = await prisma.friendRequest.findUnique({
                where: { id: parseInt(String(id)) },
            });
            if (!request)
                return res.status(400).json({ error: 'friend request not found' });
            if ((request.senderId !== userId && request.receiverId !== userId))
                return res.status(403).json({ error: 'Not authorized' });
            await prisma.friendRequest.delete({
                where: { id: parseInt(String(id)) },
            });
            console.log(`A friend request has been deleted by ${userId}`);
            return (res.status(204).send());
        }
        catch (error) {
            console.error(error);
            return (res.status(500).json({ error: 'Error deleting friend request' }));
        }
    },
    getFriends: async (req, res) => {
        try {
            const userId = req.user.id;
            if (!userId)
                return res.status(400).json({ error: 'Invalid route ID or invalid userId' });
            const friends = await prisma.friendRequest.findMany({
                where: {
                    status: 'ACCEPTED',
                    OR: [{ senderId: userId }, { receiverId: userId }],
                },
                include: {
                    sender: { select: { id: true, username: true, name: true, avatar: true, bio: true } },
                    receiver: { select: { id: true, username: true, name: true, avatar: true, bio: true } },
                },
            });
            const friendsList = friends.map((f) => (f.senderId === userId ? f.receiver : f.sender));
            console.log(`Sucessfully retrieved all friends of ${userId}`);
            return (res.status(200).json({ friends: friendsList, count: friendsList.length }));
        }
        catch (error) {
            console.error(error);
            return (res.status(500).json({ error: 'Error fetching friends' }));
        }
    },
};
export default friendController;
