import { Request, Response, NextFunction } from 'express';
import { compareSync } from 'bcryptjs';

import { jwtBearer } from '../jwt-bearer';
import { runHook } from '../run-hook';
import { responseFilter } from '../bodyguard/response-filter';

export async function loginEndpoint(
	request: Request,
	response: Response,
	next: NextFunction
) {
	// Run model hook
	if (!runHook(request, response, 'beforeLogin', request.body)) {
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
		.catch((error) => response.error(error, response));

	// Check users
	if (!foundUsers || !foundUsers.length) {
		response.goneResponder(foundUsers, response);
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
				.catch((error) => response.error(error, response));

			// Set request user
			request.user = match;

			// Send response
			match = responseFilter(
				match,
				request.user,
				request.payloadType,
				request.userType,
				request.joinMembers
			);

			match['expiration'] = expiration;
			match['token'] = token;

			response.json(match);
		}
		else {
			// Couldn't create status
			response.sendStatus(500);
		}
	}
	else {
		response.unauthorizedResponder(
			{
				message: 'Could not authenticate user'
			},
			response
		);
	}
}
