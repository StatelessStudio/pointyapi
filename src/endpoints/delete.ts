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
	if (request.payload && request.payload instanceof BaseModel) {
		// Run model hook
		runHook(request, response, 'delete', request.params);

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