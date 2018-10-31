import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { runHook } from '../run-hook';

export async function postEndpoint(request: Request, response: Response) {
	// Run model hook
	runHook(request, response, 'post', request.body);

	// Delete undefined members
	for (const key in request.body) {
		if (request.body[key] === undefined) {
			delete request.body[key];
		}
	}

	// Validate
	const errors = await validate(request.body);

	// Check
	if (errors.length) {
		return response.validationResponder(errors, response);
	}

	// Send
	const result = await request.repository
		.save(request.body)
		.then((found) => response.postResponder(found, response))
		.catch((error) => response.error(error, response));
}