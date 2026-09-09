import { AuthenticateToken } from '../services/middlewareAuthenticateToken.js';
import notificationController from '../controllers/notificationController.js';

import { Router } from 'express';

const notificationRouter = Router();

notificationRouter.get('/notifications', AuthenticateToken, notificationController.getNotifications);
notificationRouter.patch('/notifications/:id/read', AuthenticateToken, notificationController.markAsRead);
notificationRouter.patch('/notifications/read-all', AuthenticateToken, notificationController.markAllRead);
notificationRouter.delete('/notifications/:id', AuthenticateToken, notificationController.deleteNotification);

export default notificationRouter;
