import prisma from "../services/db.js";
import { AuthenticatedRequest } from "../interfaces/interfaces.js";
import { Response } from "express";

const friendController = {
  // Envoyer une demande d'amitié
  sendFriendRequest: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { receiverId } = req.body;
      const senderId = req.user!.id;

      if (!receiverId || receiverId === senderId) {
        return res.status(400).json({ error: 'Invalid receiver ID' });
      }

      const friendRequest = await prisma.friendRequest.create({
        data: {
          senderId,
          receiverId,
        },
      });

      res.status(201).json(friendRequest);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error creating friend request' });
    }
  },

  // Récupérer toutes les demandes
  getFriendRequests: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const { type } = req.query;

      let where: any = {};
      let include = { sender: { select: { id: true, username: true, avatar: true } }, receiver: { select: { id: true, username: true, avatar: true } } };

      if (type === 'received') {
        where = { receiverId: userId };
      } else if (type === 'sent') {
        where = { senderId: userId };
      } else {
        where = {
          OR: [{ senderId: userId }, { receiverId: userId }],
        };
      }

      const requests = await prisma.friendRequest.findMany({
        where,
        include,
      });

      res.json(requests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching friend requests' });
    }
  },

  // Accepter une demande
  acceptFriendRequest: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const {id} = req.params;
      const userId = req.user!.id;

      const request = await prisma.friendRequest.findUnique({
        where: { id: parseInt(String(id)) },
      });

      if (!request || request.receiverId !== userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const updated = await prisma.friendRequest.update({
        where: { id: parseInt(String(id)) },
        data: { status: 'ACCEPTED' },
      });

      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error accepting friend request' });
    }
  },

  // Rejeter une demande
  rejectFriendRequest: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const request = await prisma.friendRequest.findUnique({
        where: { id: parseInt(String(id)) },
      });

      if (!request || request.receiverId !== userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const updated = await prisma.friendRequest.update({
        where: { id: parseInt(String(id)) },
        data: { status: 'REJECTED' },
      });

      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error rejecting friend request' });
    }
  },

  // Supprimer une amitié
  deleteFriendRequest: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const request = await prisma.friendRequest.findUnique({
        where: { id: parseInt(String(id)) },
      });

      if (!request || (request.senderId !== userId && request.receiverId !== userId)) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      await prisma.friendRequest.delete({
        where: { id: parseInt(String(id)) },
      });

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting friend request' });
    }
  },

  // Récupérer tous les amis (ACCEPTED)
  getFriends: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;

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

      res.json({ friends: friendsList, count: friendsList.length });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching friends' });
    }
  },
};

export default friendController;
