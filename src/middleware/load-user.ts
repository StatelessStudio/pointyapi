import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { jwtBearer } from '../jwt-bearer';
import { BaseUser } from '../models';

/**
 * Load user if a JWT Bearer header exists
 */
export async function loadUser(
	request: Request,
	response: Response,
	next: NextFunction
) {
	// Validate
	const tokenString: any = jwtBearer.getToken(request);

	if (tokenString) {
		const token = jwtBearer.dryVerify(tokenString);

		if (!token) {
			response.unauthorizedResponder('invalid token');

			return false;
		}

		// Verify
		const result = await getRepository(request.userType)
			.findOne({ id: token.id, token: tokenString })
			.catch(() => response.error(`Could not load user`));

		if (result && result instanceof BaseUser) {
			request.user = result;

			next();
		}
		else {
			response.unauthorizedResponder(`Couldn't load user`);

			return false;
		}
	}
	else {
		next();
	}
}
