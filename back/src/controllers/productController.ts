import { Request, Response } from "express";
import prisma from "../services/db.js";
import multer from 'multer';
// import express dependancies for request handling

void multer;

const ProductController =
{
	createProduct: async (req: Request, res: Response) =>
	{
		try {
			const { name, price, quantity } = req.body;

			if (!name || !price) {
				return( res.status(400).json({ status: 'ERROR', message: 'Name and price are required' }));
			}
			// req.file est généré par Multer si un fichier est envoyé dans le champ 'image'
			const file = (req as Request & { file?: Express.Multer.File }).file;
			const imageUrl = file ? `/uploads/${file.filename}` : null;

			const newProduct = await prisma.product.create({
				data: {
					name: String(name),
					price: parseInt(price, 10),
					quantity: quantity ? parseInt(quantity, 10) : 1,
					imageUrl: imageUrl,
				},
			});
			console.log(`User created an object`);
			return (res.status(201).json({ status: 'OK', data: newProduct }));
		} catch (error) { // a voir pas de throw
			console.error(error);
			return (res.status(500).json({ status: 'ERROR', message: 'Internal server error' }));
		}
	},
	GetProductById: async (req: Request<{id: string}>, res: Response) =>
	{
		try{
			const ProductId = parseInt(req.params.id, 10);
			if (isNaN(ProductId))
				return(res.status(400).json({message: `Invalid ID, must be an integer.`}))
			const product = await prisma.product.findUnique({
				where: {
					id: ProductId,
				},
			})
			if (!product)
				return (res.status(404).json({message: `Product ID not found.`}))
			console.log(`obect found !`);
			return (res.status(200).json(product));
		}
		catch (error){ // a voir pas de throw
			console.error(error);
			return (res.status(500).json({ status: 'ERROR', message: 'Internal server error' + error }));
		}
	}
}
export default ProductController;