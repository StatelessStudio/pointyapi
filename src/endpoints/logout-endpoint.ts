import { Request, Response } from 'express';
import { runHook } from '../utils/run-hook';

/**
 * Logout endpoint
 * @param request Request object to query by
 * @param response Response object to call responder with
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
