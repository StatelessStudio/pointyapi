import { Request, Response } from 'express';
import { NextFunction } from 'connect';

export function deleteGuard(
	request: Request,
	response: Response,
	next: NextFunction
) {
	next();
}
