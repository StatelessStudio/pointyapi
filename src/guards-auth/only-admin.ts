import { Request, Response, NextFunction } from 'express';

import { BaseUser } from '../models/base-user';
import { UserRole } from '../enums/user-role';

export function onlyAdmin(
	request: Request,
	response: Response,
	next: NextFunction
) {
	if (
		request.user instanceof BaseUser &&
		request.user.role === UserRole.Admin
	) {
		next();
	}
	else {
		response.unauthorizedResponder('not admin', response);
	}
}
