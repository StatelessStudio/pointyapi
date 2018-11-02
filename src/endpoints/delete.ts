import { Request, Response } from 'express';
import { BaseModel } from '../models/base-model';
import { runHook } from '../run-hook';

/**
 * Delete the object represent by the url key/value
 * @param request Request object to query by
 * @param response Response object to call responder with
 */
export async function deleteEndpoint(request: Request, response: Response) {
	// Check response
	if (request.params && request.params instanceof BaseModel) {
		// Convert to model
		request.params = Object.assign(
			new request.payloadType(),
			request.params
		);

		for (const key in request.params) {
			if (request.params[key] === undefined) {
				delete request.params[key];
			}
		}

		// Run model hook
		if (!await runHook(request, response, 'delete', request.params)) {
			return;
		}

		// Delete
		await request.repository
			.remove(request.params)
			.then((result) => response.deleteResponder(result, response))
			.catch((error) => response.error(error, response));
	}
	else {
		// No payload
		response.goneResponder(request.payload, response);
		return;
	}
}
