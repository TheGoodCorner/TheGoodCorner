import { Router } from 'express';
import controller from '../controllers/generalController.js';
import { AuthenticateToken } from '../services/middlewareAuthenticateToken.js';

const generalGetRouter: Router = Router();

/**
 * ensemble de get routes normalement gerees par le frontend en static serving via react
 * a supprimer apres avoir vu avec tout le monde
 * @param 'path' string
 * @param 'express Request and response' express Object
 */

generalGetRouter.get('/products', controller.getProductsPage);
generalGetRouter.get(`/signup`, controller.getSignUpPage);

// generalGetRouter.get(`/user/profile`, AuthenticateToken, controller.userProfile)

export default generalGetRouter;