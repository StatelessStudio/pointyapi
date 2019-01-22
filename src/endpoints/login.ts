import { Request, Response, NextFunction } from 'express';
import { compareSync } from 'bcryptjs';

import { jwtBearer } from '../jwt-bearer';
import { runHook } from '../run-hook';
import { responseFilter } from '../bodyguard/response-filter';

/**
 * Login endpoint
 */
export async function loginEndpoint(
	request: Request,
	response: Response
): Promise<void> {
	// Run model hook
	if (!await runHook(request, response, 'login', request.body)) {
		return;
	}

	// Delete undefined members
	for (const key in request.body) {
		if (request.body[key] === undefined) {
			delete request.body[key];
		}
	}

	// Load users
	const foundUsers = await request.repository
		.createQueryBuilder('user')
		.where('user.username=:name OR user.email=:name')
		.setParameters({ name: request.body.__user })
		.getMany()
		.catch((error) => response.error(error));

	// Check users
	if (!foundUsers || !foundUsers.length) {
		response.goneResponder(foundUsers);
		return;
	}

	// Find match & check password
	let match;
	if (foundUsers && foundUsers instanceof Array) {
		foundUsers.forEach((foundUser) => {
			let isMatch = false;

			if (foundUser['tempPassword'] && !foundUser['password']) {
				isMatch = compareSync(
					request.body.password,
					foundUser['tempPassword']
				);
			}
			else {
				isMatch = compareSync(
					request.body.password,
					foundUser['password']
				);
			}

			if (isMatch) {
				match = foundUser;
			}
		});
	}

	// Check matching user
	if (match) {
		// Create token
		const expiration = jwtBearer.getExpiration();
		const token = jwtBearer.sign(match);

		if (token) {
			// Save token
			match.token = token;
			await request.repository
				.save(match)
				.catch((error) => response.error(error));

			// Set request user
			request.user = match;

			// Create response
			match = responseFilter(
				match,
				request.user,
				request.payloadType,
				request.userType
			);

			match['expiration'] = expiration;
			match['token'] = token;

			// Send response
			response.json(match);
		}
		else {
			// Couldn't create status
			response.sendStatus(500);
		}
	}
	else {
		// No match found
		response.unauthorizedResponder('Could not authenticate user');
	}
}
