import { BaseUser } from '../models';
import { getCanWrite } from '../bodyguard';
import { isSelf, isAdmin } from '../utils';
import { BodyguardOwner } from '../enums';

/**
 * Filter an incoming request body to ensure it doesn't allow sensitive fields
 * @param obj Object or array to check (recursive).
 * 	This can be the direct obj set of a typeorm request
 * @param user User object to check against
 * @param objType Type of object
 * @param userType Type of user
 * @param isSelfResult If the usr owns the object
 * @return Returns true on success, or a string of the member name which failed.
 */
export function writeFilter(
	obj: any | any[],
	user: BaseUser,
	objType: any,
	userType: any,
	isSelfResult?: boolean
): boolean | string {
	if (obj instanceof Array) {
		// Recurse array of objects
		for (let i = 0; i < obj.length; i++) {
			const result = writeFilter(
				obj[i],
				user,
				objType,
				userType,
				isSelfResult
			);
			if (result !== true) {
				return `[#${i}]${result}`;
			}
		}
	}
	else if (obj instanceof Object) {
		// Check if user owns the object
		if (isSelfResult === undefined) {
			isSelfResult = isSelf(obj, user, objType, userType);
		}

		// Check if user is admin
		const isAdminResult = isAdmin(user);

		// Loop through object members
		for (const member in obj) {
			if (!(obj[member] instanceof Function)) {
				const canWrite = getCanWrite(new objType(), member);

				if (canWrite === undefined) {
					// Cannot write PointyAPI special keys
					if (member.indexOf('__') !== 0) {
						return member;
					}
				}
				else if (
					canWrite !== BodyguardOwner.Anyone &&
					((canWrite === BodyguardOwner.Self && !isSelfResult) ||
						(canWrite === BodyguardOwner.Admin && !isAdminResult))
				) {
					// No permission to write this field
					return member;
				}
			}
		}
	}

	return true;
}
