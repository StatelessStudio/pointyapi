import { Request, Response, NextFunction } from 'express';

import { BaseUser } from '../models/base-user';
import { UserStatus } from '../enums/user-status';

export function onlyActive(
	request: Request,
	response: Response,
	next: NextFunction
) {
	if (
		request.user instanceof BaseUser &&
		request.user.status === UserStatus.Active
	) {
		next();
	}
	else {
		response.unauthorizedResponder('not active', response);
	}
}
