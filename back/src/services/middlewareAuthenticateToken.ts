import { Request, Response, NextFunction } from "express";
import * as core from 'express-serve-static-core';
import { verifyAcessToken, tokenPayload } from "../utils/jsonWebTokens.js";

// make the interface generic takes things from express Request interface
export interface AuthenticatedRequest<
	P = core.ParamsDictionary,
	ResBody = any,
	ReqBody = any,
	ReqQuery = core.Query
> extends Request<P, ResBody, ReqBody, ReqQuery> {
	user?: tokenPayload;
}
export const AuthenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
	const authHeaders = req.headers['authorization']; //extratc authorization header
	const token = authHeaders && authHeaders.split(' ')[1];
	if (!token)
		return (res.status(401).json({status: 'ERROR', message: 'Access token missing'}));
	try {
		const decodedPayload = verifyAcessToken(token);
		req.user = decodedPayload;
		next();
	}
	catch (error)
	{
		console.log(` error occured in middlewareAuthentificate` + error);
		return (res.status(403).json({status: 'ERROR', message: 'invalid or expired access token'}));
	}
}