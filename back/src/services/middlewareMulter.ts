import multer from 'multer';
import { Request } from 'express'
import { randomUUID } from 'crypto';
import createError from 'http-errors';

// import multer and path dependencies

/**
 * create the storage locations of the file and give the stored file unique name
 */
const storage = multer.diskStorage({
	destination: (
		req: Request,
		file: Express.Multer.File,
		callback: CallableFunction,) =>{
		callback(null, '/app/uploads');
		void req;
		void file;
	},
	filename: (req, file, callback) => {
	const id = randomUUID();
	const extArray = file.mimetype.split('/');
	const extension = extArray[extArray.length - 1];
	callback(null, `${id}.${extension}`);
	void req;
	}
})
/** 
 * filter the images if their original extension is not part of the extension list callback create a 400 bad request error
 */
const fileFilter = (
	req: Request,
	file: Express.Multer.File,
	callback: CallableFunction,) => {
	if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
		return callback(createError(400,('Only image files are allowed')), false);
	callback(null, true);
	void req;
};
// export a multer instance so you can use it on post routes
export const uploadMiddleware = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 }});