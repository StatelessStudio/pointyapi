import { Response } from 'express';

export function deleteResponder(result: any, response: Response) {
	// Result should have ID
	if ('id' in result) {
		// Send response
		response.sendStatus(204);
	}
	else {
		// Send error
		response.error('ID not found in Delete Response', response);
	}
}
