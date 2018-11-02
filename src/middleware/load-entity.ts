import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { getIdentifierValue } from '../get-identifier-value';

export async function loadEntity(
	request: Request,
	response: Response,
	next?: NextFunction
) {
	if (request.identifier) {
		const result = await request.repository
			.findOne(getIdentifierValue(request))
			.catch(() =>
				response.error({ message: `Could not load entity` }, response)
			);

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
			response.goneResponder(`Couldn't load entity`, response);
			return false;
		}
	}
	else {
		response.error(
			'Could not load entity on a route without a parameter',
			response
		);
		return false;
	}
}
