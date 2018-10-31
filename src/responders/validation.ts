import { Response } from 'express';

export function validationResponder(errors: any, response: Response) {
	response.status(400);
	response.json({
		validation: errors
	});
}
