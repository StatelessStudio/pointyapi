import { Request, Response } from 'express';

/**
 * Run specified hook in the model
 * @param request Express::Request Request object to pass to hook
 * @param response Express::Response Response object to pass to hook
 * @param name string Name of hook to run
 * @param obj any Object to run hook on
 */
export async function runHook(
	request: Request,
	response: Response,
	name: string,
	obj: any
): Promise<boolean> {
	// Run model hook
	let hookResult = false;
	if (name in obj) {
		hookResult = await obj[name](request, response);

		if (!hookResult) {
			// Hook failed
			if (!response.headersSent) {
				// Respond with 500 error if this has not responded yet
				response.error('Could not complete hook');
			}

			return false;
		}
	}

	// Success
	return true;
}
