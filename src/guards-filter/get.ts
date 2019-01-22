import { Request, Response, NextFunction } from 'express';

import { getCanRead, isAdmin } from '../bodyguard';
import { responseFilter } from '../bodyguard/response-filter';

/**
 * Get Filter: Filter a GET response to remove private fields
 */
export function getFilter(
	request: Request,
	response: Response,
	next: NextFunction
): void {
	let denied: boolean | string = false;

	// Check incoming
	if (request.query) {
		const isAdminResult = isAdmin(request.user);

		// Loop through object members
		for (const member in request.query) {
			if (
				!(request.query[member] instanceof Function) &&
				member.indexOf('__') !== 0
			) {
				// Get read privileges for the field
				const canRead = getCanRead(new request.payloadType(), member);

				if (canRead === undefined) {
					// No read privilege
					denied = member;
				}
				else if (
					canRead !== '__anyone__' &&
					((canRead === '__self__' && !request.user) ||
						(canRead === '__admin__' && !isAdminResult))
				) {
					// User does not have privilege
					denied = member;
				}
			}
		}
	}

	if (denied) {
		// Cannot get by member, issue 403 Forbiddenn
		response.forbiddenResponder('Cannot get by member ' + denied);
	}
	else {
		// User is authorized, filter response payload
		request.payload = responseFilter(
			request.payload,
			request.user,
			request.payloadType,
			request.userType
		);

		// Proceed
		next();
	}
}
