import { factorStatus, setupFactor, changeFactor } from '../controllers/twoFactorController.js';
import { Router } from 'express';
import userController from '../controllers/usersController.js';
import { uploadMiddleware } from '../services/middlewareMulter.js';
import { AuthenticateToken } from '../services/middlewareAuthenticateToken.js';

const userRouter = Router();

/**
 * ensemble des routes concernant les users
 */
userRouter.get('/auth/2fa', AuthenticateToken, factorStatus);
userRouter.post('/auth/2fa/setup', AuthenticateToken, setupFactor);
userRouter.post('/auth/2fa/enable', AuthenticateToken, changeFactor('enable'));
userRouter.post('/auth/2fa/disable', AuthenticateToken, changeFactor('disable'));

userRouter.post(`/auth/register`, userController.createUser);
userRouter.post(`/auth/login`, userController.login);
userRouter.post(`/auth/logout`, userController.logout);
userRouter.post(`/auth/refresh`, userController.refresh)

userRouter.get(`/user/:id`, userController.getUser);
userRouter.get(`/user`, userController.getAllUser);
userRouter.put(`/user/:id`, AuthenticateToken, uploadMiddleware.single('image'), userController.updateUser);
userRouter.delete(`/user/:id`, AuthenticateToken, userController.removeUser);

export default userRouter;

