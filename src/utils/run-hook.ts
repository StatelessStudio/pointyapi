import { Request, Response } from 'express';
import { BaseModel } from '../models';

/**
 * Run specified hook in the model
 * @param name Name of hook to run
 * @param obj Object to run hook on
 * @param request Request object to pass to hook
 * @param response Response object to pass to hook
 * @return Returns of a Promise of boolean
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
			console.error(error);
		});

	if (!hookResult) {
		// Hook failed
		if (!response.headersSent) {
			// Respond with 500 error if this has not responded yet
			response.error('Could not complete hook');
		}

		console.warn('Could not complete hook "' + name + '" on object: ', obj);
	}

	return hookResult;
}
