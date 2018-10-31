import { Response } from 'express';

export function getResponder(result: any, response: Response) {
	if (!result) {
		response.goneResponder(result, response);
	}
	else {
		// Sanitize sensitive fields
		// TODO: Sanitize sensitive data with responseFilter()

		if (result) {
			// Send response
			response.json(result);
		}
		else {
			// Send unauthorized (bodyguard removed all fields)
			response.unauthorizedResponder(result, response);
		}
	}
}
