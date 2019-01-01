import { Request, Response } from 'express';
import { validate } from 'class-validator';

import { runHook } from '../run-hook';
import { getISOTime } from '../models';

export async function putEndpoint(request: Request, response: Response) {
	// Merge payload
	request.body = Object.assign(request.payload, request.body);

	// Run model hook
	if (!runHook(request, response, 'beforePut', request.body)) {
		return;
	}

	// Pass null in place of empty strings
	if (request.payload instanceof Array) {
		request.payload.map((item: Object) => {
			for (const key in item) {
				if (item[key] === '') {
					item[key] = null;
				}
			}

			return item;
		});
	}
	else {
		for (const key in request.payload) {
			if (request.payload[key] === '') {
				request.payload[key] = null;
			}
		}
	}

	// Validate
	const errors = await validate(request.body);

	// Check
	if (errors.length) {
		response.validationResponder(errors, response);
	}
	else {
		// Check if "timeUpdated" key exists in request payload
		if ('timeUpdated' in new request.payloadType()) {
			request.body.timeUpdated = getISOTime();
		}

		await request.repository
			.save(request.body)
			.then((result) => response.putResponder(result, response))
			.catch((error) => response.error(error, response));
	}
}
