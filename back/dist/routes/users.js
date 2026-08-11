import { Router } from 'express';
import usersController from '../controllers/usersController.js';
// import { uploadMiddleware } from '../services/middlewareMulter.js';
const UController = Router();
UController.post(`/auth/register`, usersController.createUser);
UController.post(`/auth/login`, usersController.login);
UController.get(`/auth/logout`, usersController.logout);
UController.get(`/auth/refresh`, usersController.refresh);
// UController.put(/login)
// UController.delete(/login)
export default UController;
