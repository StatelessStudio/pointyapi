import { Request, Response } from 'express';
import { BaseModel } from '../models/base-model';
import { runHook } from '../utils/run-hook';

/**
 * Delete the object represent by the url key/value
 * @param request Request object to query by
 * @param response Response object to call responder with
 */
export async function deleteEndpoint(
	request: Request,
	response: Response
): Promise<void> {
	// Check response
	if (request.payload && request.payload instanceof BaseModel) {
		// Run model hook
		if (!await runHook('delete', request.payload, request, response)) {
			return;
		}

		// Delete
		await request.repository
			.remove(request.payload)
			.then((result) => response.deleteResponder(result))
			.catch((error) => response.error(error));
	}
	else {
		// No payload
		response.goneResponder(request.payload);
		return;
	}
}
