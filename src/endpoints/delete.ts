import { Request, Response } from 'express';
import { BaseModel } from '../models/base-model';

/**
 * Delete the object represent by the url key/value
 * @param request Request object to query by
 * @param response Response object to call responder with
 */
export async function deleteEndpoint(request: Request, response: Response) {
	// Run model hook
	if ('delete' in request.params) {
		request.params.delete(request, response);
	}

	// Check response
	if (request.params && request.params instanceof BaseModel) {
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
