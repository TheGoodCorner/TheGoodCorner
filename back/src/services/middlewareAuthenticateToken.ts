import { Request, Response, NextFunction } from "express";
import { verifyAcessToken, tokenPayload } from "../utils/jsonWebTokens.js";

export interface AuthenticatedRequest extends Request{
	user?: tokenPayload; // attach tokenpayload to request as user if it doesnt exist yet
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