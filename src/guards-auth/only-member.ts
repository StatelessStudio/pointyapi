import { Request, Response, NextFunction } from 'express';

import { BaseUser } from '../models/base-user';
import { UserRole } from '../enums/user-role';

export function onlyMember(
	request: Request,
	response: Response,
	next: NextFunction
) {
	if (
		request.user instanceof BaseUser &&
		request.user.role === UserRole.Member
	) {
		next();
	}
	else {
		response.unauthorizedResponder('not member');
	}
}
