import { Request, Response, NextFunction } from 'express';

import { BaseUser } from '../models/base-user';

export function onlyUser(
	request: Request,
	response: Response,
	next: NextFunction
) {
	if (request.user instanceof BaseUser) {
		next();
	}
	else {
		response.unauthorizedResponder('not user');
	}
}
