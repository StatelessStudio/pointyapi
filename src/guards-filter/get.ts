import { Request, Response, NextFunction } from 'express';
import { responseFilter } from '../bodyguard/response-filter';

export function getFilter(
	request: Request,
	response: Response,
	next: NextFunction
) {
	request.payload = responseFilter(request.payload, request.user);

	next();
}
