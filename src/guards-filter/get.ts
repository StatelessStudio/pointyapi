import { Request, Response, NextFunction } from 'express';

import { getCanRead, isSelf, isAdmin } from '../bodyguard';
import { responseFilter } from '../bodyguard/response-filter';

export function getFilter(
	request: Request,
	response: Response,
	next: NextFunction
) {
	let denied: boolean | string = false;

	// Is this a count request?
	if ('__count' in request.query && 'count' in request.payload) {
		response.getResponder(
			{
				count: +request.payload['count']
			},
			response
		);

		return;
	}

	// Check incoming
	if (request.query) {
		const isAdminResult = isAdmin(request.user);

		// Loop through object members
		for (const member in request.query) {
			if (
				!(request.query[member] instanceof Function) &&
				member.indexOf('__') !== 0
			) {
				const canRead = getCanRead(new request.payloadType(), member);

				if (canRead === undefined) {
					denied = member;
				}
				else if (
					canRead !== '__anyone__' &&
					((canRead === '__self__' && !request.user) ||
						(canRead === '__admin__' && !isAdminResult))
				) {
					denied = member;
				}
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
			request.userType,
			request.joinMembers
		);

		next();
	}
}
