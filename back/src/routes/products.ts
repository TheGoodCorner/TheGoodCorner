import { Router } from 'express';
import { uploadMiddleware } from '../services/middlewareMulter.js';
import { GetProductById } from '../services/manageProducts.js';
import productController from '../controllers/productController.js';

const pController = Router();

pController.post('/products', uploadMiddleware.single('image'), productController.createProduct);
pController.get('/products/:id', GetProductById);

// pController.put('/products/:id', productController.GetProductById);
// pController.delete('/products/:id', productController.GetProductById);

export default pController;