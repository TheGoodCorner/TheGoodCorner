import { Router } from 'express';
import { uploadMiddleware } from '../services/middlewareMulter.js';
import productController from '../controllers/productController.js';

const PostRouter = Router();

PostRouter.post('/products', uploadMiddleware.single('image'), productController.createProduct);
PostRouter.get('/products/:id', productController.GetProductById);

export default PostRouter;