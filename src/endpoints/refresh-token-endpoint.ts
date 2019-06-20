import { Request, Response } from 'express';

import { jwtBearer } from '../jwt-bearer';
import { runHook } from '../utils/run-hook';
import { readFilter } from '../bodyguard/read-filter';
import { BaseUser } from '../models';

/**
 * Refresh the user's token
 * @param request Request object to query by
 * @param response Response object to call responder with
 */
export async function refreshTokenEndpoint(
	request: Request,
	response: Response
): Promise<void> {
	// Check request body
	if ('__refreshToken' in request.body) {
		// Check refresh token
		const token = jwtBearer.dryVerify(request.body.__refreshToken);

		if (token && 'isRefresh' in token && token.isRefresh) {
			// Load user
			let match = await request.repository
				.findOne({ id: token.id })
				.catch((error) => response.error(error));

			// Check matching user
			if (match && match instanceof BaseUser) {
				// Create token
				const expiration = jwtBearer.getExpiration();
				const token = jwtBearer.sign(match);

				// Set request user
				request.user = match;

				// Create response
				match = readFilter(
					match,
					request.user,
					request.payloadType,
					request.userType
				);

				match['expiration'] = expiration;
				match['token'] = token;

				// Send response
				if (
					!await runHook(
						'tokenRefresh',
						request.user,
						request,
						response
					)
				) {
					return;
				}

				response.json(match);
			}
			else {
				// No match found
				response.unauthorizedResponder('Could not authenticate user');
			}
		}
		else {
			// No match found
			response.unauthorizedResponder('Could not authenticate user');
		}
	}
	else {
		// Respond with 400
		response.validationResponder('No refresh token sent');
	}
}
