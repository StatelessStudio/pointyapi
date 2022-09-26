import { Request, Response } from '../index';
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

		if (!await runHook('afterLogout', request.user, request, response)) {
			return;
		}

		request.user = undefined;

		response.deleteResponder({});
	}
	else {
		// User is not logged in
		response.unauthorizedResponder('Could not authenticate user');
	}
}
