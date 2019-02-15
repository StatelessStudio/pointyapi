import { Request, Response } from 'express';
import { BaseModel } from '../models';

/**
 * Run specified hook in the model
 * @param name string Name of hook to run
 * @param obj any Object to run hook on
 * @param request Express::Request Request object to pass to hook
 * @param response Express::Response Response object to pass to hook
 */
export async function runHook(
	name: string,
	obj: BaseModel | BaseModel[],
	request: Request,
	response: Response
): Promise<boolean> {
	// Run model hook
	let hookResult = false;
	const promises = [];

	if (obj instanceof Array) {
		for (const each of obj) {
			if (name in each) {
				promises.push(each[name].bind(each)(request, response));
			}
		}
	}
	else if (name in obj) {
		promises.push(obj[name].bind(obj)(request, response));
	}

	await Promise.all(promises)
		.then((results) => {
			hookResult = true;

			for (let i = 0; i < results.length; i++) {
				if (!results[i]) {
					hookResult = false;

					break;
				}
			}
		})
		.catch((error) => {
			hookResult = false;
		});

	if (!hookResult) {
		// Hook failed
		if (!response.headersSent) {
			// Respond with 500 error if this has not responded yet
			response.error('Could not complete hook');
		}
	}

	return hookResult;
}
