import { Request, Response } from 'express';
import { BaseModel } from '../models/base-model';
import { runHook } from '../run-hook';

/**
 * Delete the object represent by the url key/value
 * @param request Request object to query by
 * @param response Response object to call responder with
 */
export async function getEndpoint(request: Request, response: Response) {
	if (
		request.payload &&
		(request.payload instanceof Array ||
			request.payload instanceof BaseModel)
	) {
		// Check response
		// Run model hook
		if (!runHook(request, response, 'beforeGet', request.payload)) {
			return;
		}

		// Is this a count request?
		if (
			'__count' in request.query &&
			request.query.__count &&
			request.payload instanceof Array
		) {
			response.getResponder(
				{
					count: +request.payload.length
				},
				response
			);
		}
		else {
			response.getResponder(request.payload, response);
		}
	}
	else {
		// No payload
		response.goneResponder(request.payload, response);
		return;
	}
}
