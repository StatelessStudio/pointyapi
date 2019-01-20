import { Request, Response, NextFunction } from 'express';
import { compareSync } from 'bcryptjs';

import { jwtBearer } from '../jwt-bearer';
import { runHook } from '../run-hook';

export async function logoutEndpoint(
	request: Request,
	response: Response,
	next: NextFunction
) {
	// Run model hook
	if (!await runHook(request, response, 'beforeLogOut', request.body)) {
		return;
	}

	// Check user
	if (request.user) {
		request.user.token = '';

		await request.repository
			.save(request.user)
			.then((result) => response.deleteResponder(result))
			.catch((error) => response.error(error));

		request.user = undefined;
	}
	else {
		response.unauthorizedResponder({
			message: 'Could not authenticate user'
		});
	}
}
