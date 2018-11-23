import { Response } from 'express';

export function deleteResponder(result: any, response: Response) {
	if (result instanceof Object) {
		// Send response
		response.sendStatus(204);
	}
	else {
		// Send error
		response.error('ID not found in Delete Response', response);
	}
}
