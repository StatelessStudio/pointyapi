import { Request, Response, NextFunction } from 'express';

import { BaseUser } from '../models/base-user';
import { UserStatus } from '../enums/user-status';

/**
 * Only Actie Guard: Check if the user has a status
 *	and that it matches UserStatus.Active, otherwise
 *	respond with 401 Unauthorized
 */
export function onlyActive(
	request: Request,
	response: Response,
	next: NextFunction
): void {
	if (
		request.user instanceof BaseUser &&
		request.user.status === UserStatus.Active
	) {
		// User is active
		next();
	}
	else {
		// User is not authenticated or active, respond with 401 Unauthorized
		response.unauthorizedResponder('not active');
	}
}
