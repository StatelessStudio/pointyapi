import { Request, Response, NextFunction } from 'express';
import { writeFilter } from '../bodyguard/write-filter';

export function postFilter(
	request: Request,
	response: Response,
	next: NextFunction
) {
	// Posting new user is always self
	let isSelfResult;

	if (request.method === 'POST' && request.payloadType === request.userType) {
		isSelfResult = true;
	}

	const writeFilterResult = writeFilter(
		request.body,
		request.user,
		request.payloadType,
		request.userType,
		isSelfResult
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
}
