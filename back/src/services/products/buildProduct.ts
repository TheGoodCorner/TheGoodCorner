import {Request, Response} from 'express'
import { Prisma } from '@prisma/client';


interface ProductCrInput {
	body: {
		name?: string | undefined;
		price?: string | number | undefined;
		quantity?: string | number | undefined;
		CategoryId?: string | number | undefined;
	};
	file?: Express.Multer.File | undefined;
	userId: string | number;
}
export const buildProduct = ({ body, file, userId}: ProductCrInput): Prisma.ProductCreateInput =>{
	const { name, price, quantity, CategoryId} = body;
	if (!name || price === undefined || price === null || !CategoryId) {
		throw new Error('Name, price, and CategoryId are required.');
	}

	const parsedPrice = typeof price === 'number' ? price : parseInt(price, 10);
	const parsedCategoryId = typeof CategoryId === 'number' ? CategoryId : parseInt(CategoryId, 10);
	const parsedUserId = typeof userId === 'number' ? userId : parseInt(String(userId), 10);
	const parsedQuantity = quantity ? (typeof quantity === 'number' ? quantity : parseInt(quantity, 10)) : 1;

	return {
		name: String(name),
		price: parsedPrice,
		quantity: parsedQuantity,
		imageUrl: file ? `/uploads/${file.filename}` : null,
		author: {
			connect: { id: parsedUserId }, // Matches 'authorId Int'
		},
		Category: {
			connect: { id: parsedCategoryId }, // Matches 'CategoryId Int'
		},
	};
};

