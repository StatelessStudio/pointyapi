import { Request, Response, NextFunction } from 'express';
import { getIdentifierValue } from '../utils/get-identifier-value';

/**
 * Load resource represented by the URL ID
 * Example:
 * 	/users/12 -> Load #12
 * @param request Express request
 * @param response Express response
 * @param next Next function to call on success
 * @return Returns a Promise of boolean
 */
export async function loadEntity(
	request: Request,
	response: Response,
	next?: NextFunction
): Promise<boolean> {
	if (request.identifier) {
		const value = getIdentifierValue(request);

		if (value) {
			const result = await request.repository
				.findOne(value)
				.catch(() => response.error(`Could not load entity`));

			if (result && result instanceof request.payloadType) {
				request.payload = result;

				if (next) {
					next();

					return true;
				}
				else {
					return true;
				}
			}
			else {
				response.goneResponder(`Could not load entity`);
				return false;
			}
		}
		else {
			response.validationResponder('Invalid request parameters');
		}
	}
	else {
		response.error('Could not load entity on a route without a parameter');
		return false;
	}
}
