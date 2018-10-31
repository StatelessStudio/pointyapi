import { Response } from 'express';

export function conflictResponder(result: any, response: Response) {
	// Send response
	response.status(409).json(result);
}
