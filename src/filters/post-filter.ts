import { Request, Response, NextFunction } from '../index';
import { writeFilter } from '../bodyguard/write-filter';

/**
 * Post Filter: Filter a POST request payload, and respond with
 * 	403 Forbidden if the request contains any private fields
 * @param request Request object to query by
 * @param response Response object to call responder with
 * @param next Next function to call on success
 */
export function postFilter(
	request: Request,
	response: Response,
	next: NextFunction
): void {
	// Posting new user is always self
	let isSelfResult;
	if (request.payloadType === request.userType) {
		isSelfResult = true;
	}

	// Filter request body
	const writeFilterResult = writeFilter(
		request.body,
		request.user,
		request.payloadType,
		request.userType,
		isSelfResult
	);

	if (writeFilterResult === true) {
		// Post body is okay, proceed
		next();
	}
	else {
		// Cannot write member, respond with 403 Forbidden
		response.forbiddenResponder('Cannot write member ' + writeFilterResult);
	}
}
