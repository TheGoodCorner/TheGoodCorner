import { Router } from 'express';
import { uploadMiddleware } from '../services/middlewareMulter.js';
import controller from '../controllers/controllers.js';

const PostRouter = Router();

PostRouter.post('/products', uploadMiddleware.single('image'), controller.createProduct);

export default PostRouter;