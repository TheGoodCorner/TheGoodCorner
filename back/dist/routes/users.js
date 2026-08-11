import { Router } from 'express';
import userController from '../controllers/usersController.js';
// import { uploadMiddleware } from '../services/middlewareMulter.js';
const userRouter = Router();
/**
 * ensemble des routes concernant les users
 */
userRouter.post(`/auth/register`, userController.createUser);
userRouter.post(`/auth/login`, userController.login);
userRouter.post(`/auth/logout`, userController.logout);
userRouter.post(`/auth/refresh`, userController.refresh);
// userRouter.get(`/user/:id`, userController.)
// userRouter.put(/login) // update un user
// userRouter.delete(/login) // delete un user
export default userRouter;
