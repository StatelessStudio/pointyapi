import { Request, Response, NextFunction } from '../index';

import { getCanRead, readFilter } from '../bodyguard';
import { isAdmin } from '../utils';
import { queryTypeKeys, QueryType } from '../query-tools/query-types';
import { BodyguardOwner } from '../enums';

/**
 * Get Filter: Filter a GET response to remove private fields
 * @param request Request object to query by
 * @param response Response object to call responder with
 * @param next Next function to call on success
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
		let queryType: QueryType;
		for (queryType of queryTypeKeys) {
			// Skip joins
			if (queryType === 'join' || queryType === 'additionalParameters') {
				continue;
			}

			const value: unknown = request.query[queryType];

			if (value instanceof Array) {
				for (let member of value) {
					if (member.includes('.')) {
						member = member.split('.')[0];
					}

					if (
						!(value[member] instanceof Function) &&
						member.indexOf('__') !== 0
					) {
						// Get read privileges for the field
						const canRead = getCanRead(
							new request.payloadType(),
							member
						);

						if (
							canRead === undefined ||
							(canRead !== BodyguardOwner.Anyone &&
								((canRead === BodyguardOwner.Self &&
									!request.user) ||
									(canRead === BodyguardOwner.Admin &&
										!isAdminResult)))
						) {
							// User does not have privilege
							denied = member;
						}
					}
				}
			}
			else if (value instanceof Object) {
				for (let member in value) {
					if (member.includes('.')) {
						member = member.split('.')[0];
					}

					if (
						!(value[member] instanceof Function) &&
						member.indexOf('__') !== 0
					) {
						// Get read privileges for the field
						const canRead = getCanRead(
							new request.payloadType(),
							member
						);

						if (
							canRead === undefined ||
							(canRead !== BodyguardOwner.Anyone &&
								((canRead === BodyguardOwner.Self &&
									!request.user) ||
									(canRead === BodyguardOwner.Admin &&
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
