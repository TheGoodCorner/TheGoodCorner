import { Router } from 'express';
import { uploadMiddleware } from '../services/middlewareMulter.js';
import { GetProductById } from '../services/manageProducts.js';
import productController from '../controllers/productController.js';
import { AuthenticateToken } from '../services/middlewareAuthenticateToken.js';
const productRouter = Router();

productRouter.post('/products', AuthenticateToken , uploadMiddleware.single('image'), productController.createProduct);
productRouter.get('/products/:id', GetProductById);

// productRouter.put('/products/:id', productController.GetProductById);
// productRouter.delete('/products/:id', productController.GetProductById);

export default productRouter;