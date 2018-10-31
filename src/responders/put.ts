import { Response } from 'express';

export function putResponder(result: any, response: Response) {
	// Result should have ID
	if ('id' in result) {
		// Send response
		response.sendStatus(204);
	}
	else {
		// Send error
		response.error('ID not found in Put Response', response);
	}
}
