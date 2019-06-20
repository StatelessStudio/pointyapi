import { Request, Response } from 'express';
import { compareSync } from 'bcryptjs';

import { jwtBearer } from '../jwt-bearer';
import { runHook } from '../utils/run-hook';
import { readFilter } from '../bodyguard/read-filter';

/**
 * Login endpoint
 * @param request Request object to query by
 * @param response Response object to call responder with
 */
export async function loginEndpoint(
	request: Request,
	response: Response
): Promise<void> {
	// Check input
	if (!('__user' in request.body)) {
		response.validationResponder('__user is required');
		return;
	}

	if (!('password' in request.body)) {
		response.validationResponder('password is required');
		return;
	}

	// Run model hook
	if (!await runHook('login', request.body, request, response)) {
		return;
	}

	// Determine login __user fields
	const fields = [ 'username', 'email' ];

	if (request.userType && 'tempEmail' in new request.userType()) {
		fields.push('tempEmail');
	}

	// Create where query
	const where = [];

	for (const field of fields) {
		const pair = {};
		pair[field] = request.body.__user;
		where.push(pair);
	}

	const foundUsers = await request.repository
		.find({
			where: where
		})
		.catch((error) => response.error(error));

	// Check users
	if (!foundUsers || !foundUsers.length) {
		response.unauthorizedResponder('Could not authenticate user');
		return;
	}

	// Find match & check password
	let match;
	if (foundUsers && foundUsers instanceof Array) {
		foundUsers.forEach((foundUser) => {
			let isMatch = false;

			if (
				'password' in request.body &&
				request.body.password &&
				'password' in foundUser &&
				foundUser['password']
			) {
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

		const refreshExpiration = jwtBearer.getExpiration(true);
		const refreshToken = jwtBearer.sign(match, true);

		if (token && refreshToken) {
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
			match['refreshExpiration'] = refreshExpiration;
			match['refreshToken'] = refreshToken;

			// Send response
			if (!await runHook('afterLogin', request.user, request, response)) {
				return;
			}

			response.json(match);
		}
		else {
			// Couldn't create token
			response.error('Could not create create auth token');
		}
	}
	else {
		// No match found
		response.unauthorizedResponder('Could not authenticate user');
	}
}
