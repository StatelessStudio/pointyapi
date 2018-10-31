import { Request, Response } from 'express';

export async function runHook(
	request: Request,
	response: Response,
	name: string,
	obj: object
) {
	// Run model hook
	if (name in obj) {
		const result = obj[name](request, response);

		if (result instanceof Promise) {
			return await result;
		}
		else {
			return result;
		}
	}

	return true;
}
