export const buildProduct = ({ body, file, userId }) => {
    const { name, price, quantity, category } = body;
    if (!name || price === undefined || price === null || !category) {
        throw new Error('Name, price, and CategoryId are required.');
    }
    const parsedPrice = typeof price === 'number' ? price : parseInt(price, 10);
    const parsedCategoryId = typeof category === 'number' ? category : parseInt(category, 10);
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
        category: {
            connectOrCreate: {
                where: { name: category },
                create: { name: category }
            }
        }
    };
};
