import { Request, Response, NextFunction } from 'express';

import { getCanRead, readFilter } from '../bodyguard';
import { isAdmin } from '../utils';
import { queryTypeKeys } from '../utils/query-types';

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
		let field: any;
		for (field of queryTypeKeys) {
			// Skip joins
			if (field === 'join') {
				continue;
			}

			field = request.query[field];

			if (field instanceof Array) {
				for (let member of field) {
					if (member.includes('.')) {
						member = member.split('.')[0];
					}

					if (
						!(field[member] instanceof Function) &&
						member.indexOf('__') !== 0
					) {
						// Get read privileges for the field
						const canRead = getCanRead(
							new request.payloadType(),
							member
						);

						if (
							canRead === undefined ||
							(canRead !== '__anyone__' &&
								((canRead === '__self__' && !request.user) ||
									(canRead === '__admin__' &&
										!isAdminResult)))
						) {
							// User does not have privilege
							denied = member;
						}
					}
				}
			}
			else if (field instanceof Object) {
				for (let member in field) {
					if (member.includes('.')) {
						member = member.split('.')[0];
					}

					if (
						!(field[member] instanceof Function) &&
						member.indexOf('__') !== 0
					) {
						// Get read privileges for the field
						const canRead = getCanRead(
							new request.payloadType(),
							member
						);

						if (
							canRead === undefined ||
							(canRead !== '__anyone__' &&
								((canRead === '__self__' && !request.user) ||
									(canRead === '__admin__' &&
										!isAdminResult)))
						) {
							// User does not have privilege
							denied = member;
						}
					}
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
		request.payload = readFilter(
			request.payload,
			request.user,
			request.payloadType,
			request.userType
		);

		// Proceed
		next();
	}
}
