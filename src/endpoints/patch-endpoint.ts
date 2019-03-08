import { Request, Response } from 'express';
import { validate } from 'class-validator';

import { runHook } from '../utils/run-hook';
import { getISOTime } from '../models';

/**
 * Patch endpoint
 * @param request Request object to query by
 * @param response Response object to call responder with
 */
export async function patchEndpoint(
	request: Request,
	response: Response
): Promise<void> {
	// Merge payload
	request.body = Object.assign(request.payload, request.body);

	// Run model hook
	if (!await runHook('patch', request.body, request, response)) {
		return;
	}

	// Pass null in place of empty strings
	for (const key in request.payload) {
		if (request.payload[key] === '') {
			request.payload[key] = null;
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
			.then(async (result) => {
				if (
					!await runHook(
						'afterPatch',
						request.payload,
						request,
						response
					)
				) {
					return;
				}

				response.patchResponder(result);
			})
			.catch((error) => response.error(error));
	}
}
