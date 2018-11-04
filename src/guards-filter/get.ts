import { Request, Response, NextFunction } from 'express';

import { getCanRead, isSelf, isAdmin } from '../bodyguard';
import { responseFilter } from '../bodyguard/response-filter';

export function getFilter(
	request: Request,
	response: Response,
	next: NextFunction
) {
	let denied: boolean | string = false;

	// Check incoming
	if (request.payload instanceof request.payloadType) {
		const isSelfResult = isSelf(
			request.query,
			request.user,
			request.payloadType,
			request.userType
		);
		const isAdminResult = isAdmin(request.user);

		// Loop through object members
		for (const member in request.query) {
			const canRead = getCanRead(new request.payloadType(), member);

			if (canRead === undefined) {
				denied = member;
			}
			else if (
				canRead !== '__anyone__' &&
				((canRead === '__self__' && !isSelfResult) ||
					(canRead === '__admin__' && !isAdminResult))
			) {
				denied = member;
			}
		}
	}

	if (denied) {
		response.forbiddenResponder('Cannot get by member ' + denied, response);
	}
	else {
		// Filter outgoing
		request.payload = responseFilter(
			request.payload,
			request.user,
			request.payloadType,
			request.userType
		);

		next();
	}
}
