import { Response } from 'express';

export function goneResponder(result: any, response: Response) {
	// Send response
	response.status(410).json(result);
}
