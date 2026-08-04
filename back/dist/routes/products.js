import { Router } from 'express';
import { uploadMiddleware } from '../services/middlewareMulter.js';
import controller from '../controllers/controllers.js';
const router = Router();
router.post('/products', uploadMiddleware.single('image'), controller.createProduct);
export default router;
