import { Request, Response, NextFunction } from 'express';
import { runHook } from '../run-hook';

export async function logoutEndpoint(request: Request, response: Response) {
	// Run model hook
	if (!await runHook(request, response, 'logout', request.body)) {
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
		response.unauthorizedResponder('Could not authenticate user');
	}
}
