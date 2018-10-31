import { Response } from 'express';

export function forbiddenResponder(result: any, response: Response) {
	response.status(403).json(result);
}
