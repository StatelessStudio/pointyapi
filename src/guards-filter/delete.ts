import { Request, Response, NextFunction } from 'express';

export function deleteFilter(
	request: Request,
	response: Response,
	next: NextFunction
) {
	next();
}
