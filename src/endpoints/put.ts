import { Request, Response } from 'express';
import { validate } from 'class-validator';

import { runHook } from '../run-hook';

export async function putEndpoint(request: Request, response: Response) {
	// Merge payload
	request.body = Object.assign(request.payload, request.body);

	// Run model hook
	if (!runHook(request, response, 'onBeforePut', request.body)) {
		return;
	}

	// Validate
	const errors = await validate(request.body);

	// Check
	if (errors.length) {
		response.validationResponder(errors, response);
	}
	else {
		await request.repository
			.save(request.body)
			.then((result) => response.putResponder(result, response))
			.catch((error) => response.error(error, response));
	}
}
