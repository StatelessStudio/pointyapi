import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { jwtBearer } from '../jwt-bearer';
import { BaseUser } from '../models';

export async function loadUser(
	request: Request,
	response: Response,
	next: NextFunction
) {
	// Validate
	let token: any = jwtBearer.getToken(request);

	if (token) {
		token = jwtBearer.dryVerify(token);

		if (!token) {
			return response.unauthorizedResponder('invalid token', response);
		}

		// Verify
		const result = await getRepository(request.userType)
			.findOne({ id: token.id })
			.catch(() =>
				response.error({ message: `Could not load user` }, response)
			);

		if (result && result instanceof BaseUser) {
			request.user = result;
			next();
		}
		else {
			response.unauthorizedResponder(`Couldn't load user`, response);
		}
	}
	else {
		next();
	}
}
