import prisma from "../services/db.js";
// import express dependancies for request handling
// request has already been processed by multer before arriving here since its a middleware, req.file has been filtered already
/**
 * create a product inside the prisma database by taking the request and sending the json object
 * @param request
 * @returns promise containing the json object
 */
const ProductController = {
    createProduct: async (req, res) => {
        try {
            const userId = req.user?.id;
            if (!userId)
                return res.status(401).json({ status: 'ERROR', message: 'Unauthorized' });
            const { name, price, quantity, CategoryId } = req.body;
            if (!name || !price || !CategoryId) {
                return (res.status(400).json({ status: 'ERROR', message: 'Name and price and userId are mandatory' }));
            }
            // req.file est généré par Multer si un fichier est envoyé dans le champ 'image'
            const file = req.file;
            const imageUrl = file ? `/uploads/${file.filename}` : null;
            const newProduct = await prisma.product.create({
                data: {
                    name: String(name),
                    price: parseInt(price, 10),
                    quantity: quantity ? parseInt(quantity, 10) : 1,
                    imageUrl: imageUrl,
                    UserID: String(userId), // Non-optional field from your Product model
                    author: {
                        connect: { id: userId } // Connects product to existing User by id
                    },
                    Category: {
                        connect: { id: parseInt(CategoryId, 10) } // Connects to existing Category by id
                    }
                }
            });
            console.log(`User created an object`);
            return (res.status(201).json({ status: 'OK', data: newProduct }));
        }
        catch (error) {
            console.error(error);
            return (res.status(500).json({ status: 'ERROR', message: 'Internal server error' }));
        }
    },
};
export default ProductController;
