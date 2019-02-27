import { Request, Response, NextFunction } from 'express';

import { BaseUser } from '../models/base-user';
import { UserRole } from '../enums/user-role';
import { isAdmin } from '../utils/is-admin';

/**
 * Only allow user with the role Member (or Admin+),
 * 	or respond with 401 Unauthorized
 * @param request Request object to query by
 * @param response Response object to call responder with
 * @param next Next function to call on success
 */
export function onlyMember(
	request: Request,
	response: Response,
	next: NextFunction
): void {
	if (
		request.user instanceof BaseUser &&
		(request.user.role === UserRole.Member || isAdmin(request.user))
	) {
		// User is member
		next();
	}
	else {
		// User is not authenticated or member, respond with 401 Unauthorized
		response.unauthorizedResponder('not member');
	}
}
