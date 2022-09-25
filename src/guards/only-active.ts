import { Request, Response, NextFunction } from '../index';

import { BaseUser } from '../models/base-user';
import { UserStatus } from '../enums/user-status';
import { isAdmin } from '../utils/is-admin';

/**
 * Only Actie Guard: Check if the user has a status
 *	and that it matches UserStatus.Active, otherwise
 *	respond with 403 Forbidden
 * @param request Request object to query by
 * @param response Response object to call responder with
 * @param next Next function to call on success
 */
export function onlyActive(
	request: Request,
	response: Response,
	next: NextFunction
): void {
	if (request.user instanceof BaseUser) {
		if (
			request.user.status === UserStatus.Active ||
			isAdmin(request.user)
		) {
			// User is active
			next();
		}
		else {
			// User is not active, respond with 403 Forbidden
			response.forbiddenResponder('not active');
		}
	}
	else {
		// User is not authenticated, respond with 401 Unauthorized
		response.unauthorizedResponder('not authenticated');
	}
}
