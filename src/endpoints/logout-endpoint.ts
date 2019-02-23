import { Request, Response, NextFunction } from 'express';
import { runHook } from '../utils/run-hook';

/**
 * Logout endpoint
 */
export async function logoutEndpoint(
	request: Request,
	response: Response
): Promise<void> {
	// Check user
	if (request.user) {
		// Run model hook
		if (!await runHook('logout', request.user, request, response)) {
			return;
		}

		// Update token
		request.user.token = '';

		await request.repository
			.save(request.user)
			.then((result) => response.deleteResponder(result))
			.catch((error) => response.error(error));

		request.user = undefined;
	}
	else {
		// User is not logged in
		response.unauthorizedResponder('Could not authenticate user');
	}
}
