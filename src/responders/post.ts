import { Response } from 'express';

export function postResponder(result: any, response: Response) {
	// Result should have ID
	if (result instanceof Object && 'id' in result) {
		// Send response
		// TODO: Filter out senstive info in body
		response.json(result);
	}
	else {
		// Send error
		response.error('ID not found in Post Response', response);
	}
}
