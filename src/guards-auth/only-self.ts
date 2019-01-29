import { Request, Response, NextFunction } from 'express';

import { BaseUser } from '../models/base-user';
import { UserRole } from '../enums/user-role';

import { getBodyguardKeys } from '../bodyguard';
import { isSelf } from '../utils';
import { BaseModel } from '../models/base-model';

/**
 * Only Self Guard: Return 401 Unauthorized if the User does not
 * 	own the resource
 */
export function onlySelf(
	request: Request,
	response: Response,
	next: NextFunction
): boolean {
	let authorized = false;
	const userKeys = getBodyguardKeys(new request.userType());
	const bodyKeys = getBodyguardKeys(new request.payloadType());

	if (request.user instanceof BaseUser) {
		if (request.user.role === UserRole.Admin) {
			authorized = true;
		}
		else {
			// Create
			if (request.method === 'POST') {
				authorized = isSelf(
					request.body,
					request.user,
					request.payloadType,
					request.userType,
					bodyKeys,
					userKeys
				);
			}
			else if (request.method === 'GET') {
				// Read
				if (
					request.identifier in request.query &&
					request.payload instanceof BaseModel
				) {
					// Query by id
					authorized = isSelf(
						request.payload,
						request.user,
						request.payloadType,
						request.userType,
						bodyKeys,
						userKeys
					);
				}
				else if (request.payload instanceof Array) {
					// Filter payload
					request.payload = request.payload.filter((result) => {
						return isSelf(
							result,
							request.user,
							request.payloadType,
							request.userType,
							bodyKeys,
							userKeys
						);
					});

					authorized = true;
				}
			}
			else if (
				(request.method === 'PUT' || request.method === 'PATCH') &&
				request.payload instanceof BaseModel
			) {
				// Update
				authorized = isSelf(
					request.payload,
					request.user,
					request.payloadType,
					request.userType,
					bodyKeys,
					userKeys
				);
			}
			else if (
				request.method === 'DELETE' &&
				request.payload instanceof BaseModel
			) {
				// Delete
				authorized = isSelf(
					request.payload,
					request.user,
					request.payloadType,
					request.userType,
					bodyKeys,
					userKeys
				);
			}
		}
	}

	if (authorized) {
		// User is self
		next();
	}
	else {
		// User is not authenticated or self, respond with 401 Unauthorized
		response.unauthorizedResponder('not self');

		return false;
	}
}
