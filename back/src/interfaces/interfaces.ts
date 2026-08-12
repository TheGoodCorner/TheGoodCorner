import * as core from 'express-serve-static-core';
import { Request} from "express";

export interface tokenPayload{
	id:number;
	email:string;
}

export interface ProductCrInput {
	body: {
		name?: string | undefined;
		price?: string | number | undefined;
		quantity?: string | number | undefined;
		CategoryId?: string | number | undefined;
	};
	file?: Express.Multer.File | undefined;
	userId: string | number;
}

export interface ProductUpdate {
	body: {
		name?: string | undefined;
		price?: string | number | undefined;
		quantity?: string | number | undefined;
		CategoryId?: string | number | undefined;
	};
	file?: Express.Multer.File | undefined;
}

// this is an express Request interface tailored with tokenPayload to add user property and protection to the request
// it is also made generic to be easier to pass around by taking things from express Request interface
export interface AuthenticatedRequest<
	P = core.ParamsDictionary,
	ResBody = any,
	ReqBody = any,
	ReqQuery = core.Query
> extends Request<P, ResBody, ReqBody, ReqQuery> {
	user?: tokenPayload;
}

export interface UserCrInput {
	body: {
		email: string;
		username: string;
		password: string;
		name?: string | undefined;
		bio?: string | undefined;
		locationId?: string | number | undefined;
	};
	file?: Express.Multer.File | undefined;
}

export interface UserUpdate {
	body: {
		email?: string | undefined;
		username?: string | undefined;
		password?: string | undefined;
		name?: string | undefined;
		bio?: string | undefined;
		locationId?: string | number | undefined;
	};
	file?: Express.Multer.File | undefined;
}