import { Request, Response, NextFunction } from 'express';

import { BaseUser } from '../models/base-user';
import { isAdmin } from '../utils/is-admin';

/**
 * Only Admin Guard: Responds with 403 Forbidden if the
 * 	user is not an admin
 * @param request Request object to query by
 * @param response Response object to call responder with
 * @param next Next function to call on success
 */
export function onlyAdmin(
	request: Request,
	response: Response,
	next: NextFunction
): void {
	if (request.user instanceof BaseUser) {
		if (isAdmin(request.user)) {
			// User is admin
			next();
		}
		else {
			// User is not admin, respond with 403 Forbidden
			response.forbiddenResponder('not admin');
		}
	}
	else {
		// User is not authenticated, respond with 401 Unauthorized
		response.unauthorizedResponder('not admin');
	}
}
