import { Request, Response } from 'express';

export async function runHook(
	request: Request,
	response: Response,
	name: string,
	obj: object
) {
	// Run model hook
	let hookResult = false;
	if (name in obj) {
		hookResult = await obj[name](request, response);

		if (!hookResult) {
			if (!response.headersSent) {
				response.error('Could not complete hook');
			}

			return false;
		}
	}

	return true;
}
