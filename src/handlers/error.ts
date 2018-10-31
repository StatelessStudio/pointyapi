import { Response } from 'express';
import { createTimestamp } from './create-timestamp';

export function errorHandler(error: any, response?: Response, code = 500) {
	// Check for known errors
	if (error instanceof Object && 'code' in error) {
		if (response && +error.code === 23502) {
			// Not-null violation
			response.validationResponder(
				{
					message: 'Not null violation'
				},
				response
			);
			return;
		}
		else if (response && +error.code === 23505) {
			// Duplicate key value
			response.sendStatus(409);
			return;
		}
	}

	// Unkown Errors
	console.error('[SERVER] ERROR', createTimestamp(), error);

	if (response) {
		response.sendStatus(code);
	}
}
