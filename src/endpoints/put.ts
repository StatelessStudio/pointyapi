import { Request, Response } from 'express';
import { validate } from 'class-validator';

import { runHook } from '../run-hook';

export async function putEndpoint(request: Request, response: Response) {
	// Run model hook
	if (!await runHook(request, response, 'put', request.params)) {
		return;
	}

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

	await request.repository
		.save(request.body)
		.then((result) => response.putResponder(result, response))
		.catch((error) => response.error(error, response));
}
