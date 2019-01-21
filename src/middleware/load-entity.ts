import { Request, Response, NextFunction } from 'express';
import { getIdentifierValue } from '../get-identifier-value';

export async function loadEntity(
	request: Request,
	response: Response,
	next?: NextFunction
) {
	if (request.identifier) {
		const result = await request.repository
			.findOne(getIdentifierValue(request))
			.catch(() => response.error(`Could not load entity`));

		if (result && result instanceof request.payloadType) {
			request.payload = result;

			if (next) {
				return next();
			}
			else {
				return true;
			}
		}
		else {
			response.goneResponder(`Couldn't load entity`);
			return false;
		}
	}
	else {
		response.error('Could not load entity on a route without a parameter');
		return false;
	}
}
