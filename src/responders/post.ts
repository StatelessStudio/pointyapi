import { Response } from 'express';

export function postResponder(result: any, response: Response) {
	// Result should have ID
	if (result instanceof Object || result instanceof Array) {
		// Send response
		response.json(result);
	}
	else {
		// Send error
		response.error('ID not found in Post Response', response);
	}
}
