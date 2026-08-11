import { Router } from 'express';
import controller from '../controllers/generalController.js';
const generalGetRouter = Router();
/**
 * ensemble de get routes normalement gerees par le frontend en static serving via react
 * a supprimer apres avoir vu avec tout le monde
 * @param 'path' string
 * @param 'express Request and response' express Object
 */
generalGetRouter.get('/', controller.getHomePage);
generalGetRouter.get('/login', controller.getLoginPage);
generalGetRouter.get('/products', controller.getProductsPage);
generalGetRouter.get('/paiement', controller.getPaiementPage);
generalGetRouter.get('/messages', controller.getMessagesPage);
generalGetRouter.get('/profil', controller.getProfilPage);
generalGetRouter.get(`/signup`, controller.getSignUpPage);
export default generalGetRouter;
