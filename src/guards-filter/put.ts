import { Request, Response, NextFunction } from 'express';

export function putFilter(
	request: Request,
	response: Response,
	next: NextFunction
) {
	next();
}
