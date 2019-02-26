import { Request, Response, NextFunction } from 'express';
import { writeFilter } from '../bodyguard';
import { isSelf } from '../utils';

/**
 * Patch Filter: Filter a PATCH request payload, and respond with
 * 	403 Forbidden if the request contains any private fields
 * @param request Request object to query by
 * @param response Response object to call responder with
 * @param next Next function to call on success
 */
export function patchFilter(
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
		// Patch body is okay, proceed
		next();
	}
	else {
		// Cannot write member, respond with 403 Forbidden
		response.forbiddenResponder('Cannot write member ' + writeFilterResult);
	}
}
