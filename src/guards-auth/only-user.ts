import { Request, Response, NextFunction } from 'express';
import { BaseUser } from '../models/base-user';

/**
 * Only User Guard: Return 401 Unauthorized if the user
 * 	is not logged in
 */
export function onlyUser(
	request: Request,
	response: Response,
	next: NextFunction
): void {
	if (request.user instanceof BaseUser) {
		// User is logged in
		next();
	}
	else {
		// User is not logged in, respond with 401 Unauthorized
		response.unauthorizedResponder('not user');
	}
}
