import { Request, Response, NextFunction } from 'express';

import { BaseUser } from '../models/base-user';
import { isAdmin } from '../utils/is-admin';

/**
 * Only Admin Guard: Responds with 401 Unauthorized if the
 * 	user is not an admin
 */
export function onlyAdmin(
	request: Request,
	response: Response,
	next: NextFunction
): void {
	if (request.user instanceof BaseUser && isAdmin(request.user)) {
		// User is admin
		next();
	}
	else {
		// User is not authenticated or admin, respond with 401 Unauthorized
		response.unauthorizedResponder('not admin');
	}
}
