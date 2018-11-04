import { Request, Response, NextFunction } from 'express';

export function postFilter(
	request: Request,
	response: Response,
	next: NextFunction
) {
	next();
}
