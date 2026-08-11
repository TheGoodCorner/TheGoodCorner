import { Router } from 'express';
import { uploadMiddleware } from '../services/middlewareMulter.js';
import { getProductById } from '../services/products/utilsProducts.js';
import productController from '../controllers/productController.js';
import { AuthenticateToken } from '../services/middlewareAuthenticateToken.js';
const productRouter = Router();

productRouter.post('/products', AuthenticateToken , uploadMiddleware.single('image'), productController.createProduct);
productRouter.get('/products/:id', getProductById);
productRouter.put('/products/:id', AuthenticateToken, productController.updateProduct);
productRouter.delete('/products/:id', AuthenticateToken, productController.deleteProduct);

export default productRouter;