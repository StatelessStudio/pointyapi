import { Request, Response, NextFunction } from 'express';
import { runHook } from '../run-hook';

/**
 * Logout endpoint
 */
export async function logoutEndpoint(
	request: Request,
	response: Response
): Promise<void> {
	// Run model hook
	if (!await runHook('logout', request.body, request, response)) {
		return;
	}

	// Check user
	if (request.user) {
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
