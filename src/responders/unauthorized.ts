import { Response } from 'express';

export function unauthorizedResponder(result: any, response: Response) {
	response.status(401).json(result);
}
