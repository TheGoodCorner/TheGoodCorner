import { Router } from 'express';
import controller from '../controllers/controllers.js';

const GetRouter: Router = Router();

/**
 * ensemble de get routes
 * @param 'path' string
 * @param 'express Request and response' express Object
 */

GetRouter.get('/', controller.getHomePage);
GetRouter.get('/login', controller.getLoginPage);
GetRouter.get('/products', controller.getProductsPage);
GetRouter.get('/paiement', controller.getPaiementPage);
GetRouter.get('/messages', controller.getMessagesPage);
GetRouter.get('/profil', controller.getProfilPage)

export default GetRouter;