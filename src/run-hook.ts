import { Request, Response } from 'express';

export function runHook(
	request: Request,
	response: Response,
	name: string,
	obj: object
) {
	// Run model hook
	if (name in obj) {
		return obj[name](request, response);
	}

	return true;
}
