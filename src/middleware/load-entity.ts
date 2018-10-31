import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

export async function loadEntity(
	request: Request,
	response: Response,
	next?: NextFunction
) {
	if (request.identifier) {
		const result = await request.repository
			.findOne(request.params)
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
			return response.goneResponder(`Couldn't load entity`, response);
		}
	}
	else {
		return response.error(
			'Could not load entity on a route without a parameter',
			response
		);
	}
}
