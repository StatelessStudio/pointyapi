import { Request, Response } from 'express';
import { validate } from 'class-validator';

import { runHook } from '../utils/run-hook';
import { getISOTime } from '../models';

/**
 * Put endpoint
 */
export async function putEndpoint(
	request: Request,
	response: Response
): Promise<void> {
	// Merge payload
	request.body = Object.assign(request.payload, request.body);

	// Run model hook
	if (!await runHook('put', request.body, request, response)) {
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
		response.validationResponder(errors);
	}
	else {
		// Check if "timeUpdated" key exists in request payload
		if ('timeUpdated' in new request.payloadType()) {
			request.body.timeUpdated = getISOTime();
		}

		// Save
		await request.repository
			.save(request.body)
			.then((result) => response.putResponder(result))
			.catch((error) => response.error(error));
	}
}
