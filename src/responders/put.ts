import { Response } from 'express';

export function putResponder(result: any, response: Response) {
	if (result instanceof Object) {
		// Send response
		response.sendStatus(204);
	}
	else {
		// Send error
		response.error('ID not found in Put Response', response);
	}
}
