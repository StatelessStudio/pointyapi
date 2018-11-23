import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { runHook } from '../run-hook';
import { responseFilter } from '../bodyguard/response-filter';

export async function postEndpoint(request: Request, response: Response) {
	// Set model type
	request.body = Object.assign(new request.payloadType(), request.body);

	// Delete undefined members
	for (const key in request.body) {
		if (request.body[key] === undefined) {
			delete request.body[key];
		}
	}

	// Run model hook
	if (!runHook(request, response, 'beforePost', request.body)) {
		return;
	}

	// Validate
	const errors = await validate(request.body).catch((error) =>
		response.error(error, response)
	);

	// Check
	if (errors && errors.length) {
		response.validationResponder(errors, response);
	}
	else {
		// Send
		await request.repository
			.save(request.body)
			.then((result) => {
				result = responseFilter(
					result,
					request.user,
					request.payloadType,
					request.userType,
					request.joinMembers
				);

				response.postResponder(result, response);
			})
			.catch((error) => response.error(error, response));
	}
}
