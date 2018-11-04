import { Request, Response, NextFunction } from 'express';
import { writeFilter } from '../bodyguard/write-filter';

export function putFilter(
	request: Request,
	response: Response,
	next: NextFunction
) {
	const writeFilterResult = writeFilter(
		request.body,
		request.user,
		request.payloadType,
		request.userType
	);

	if (writeFilterResult === true) {
		next();
	}
	else {
		response.forbiddenResponder(
			'Cannot write member ' + writeFilterResult,
			response
		);
	}

	next();
}
