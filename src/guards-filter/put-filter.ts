import { Request, Response, NextFunction } from 'express';
import { writeFilter } from '../bodyguard';
import { isSelf } from '../utils';

/**
 * Put Filter: Filter a PUT request payload, and respond with
 * 	403 Forbidden if the request contains any private fields
 */
export function putFilter(
	request: Request,
	response: Response,
	next: NextFunction
): void {
	// Check if user owns resource
	const isSelfResult = isSelf(
		request.payload,
		request.user,
		request.payloadType,
		request.userType
	);

	// Check incoming payload for write privelege
	const writeFilterResult = writeFilter(
		request.body,
		request.user,
		request.payloadType,
		request.userType,
		isSelfResult
	);

	if (writeFilterResult === true) {
		// Put body is okay, proceed
		next();
	}
	else {
		// Cannot write member, respond with 403 Forbidden
		response.forbiddenResponder('Cannot write member ' + writeFilterResult);
	}
}
