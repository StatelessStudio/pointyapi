import { BaseModel, BaseUser } from '../models';
import { getCanWrite, isSelf, isAdmin } from '../bodyguard';

/**
 * Filter an incoming request body to ensure it doesn't allow sensitive fields
 * @param obj Object or array to check (enables recursion).
 * 	This can be the direct obj set of a typeorm request
 * @param user User object to check against
 * @return Returns true on success, or a string of the member name which failed.
 */
export function writeFilter(
	obj: BaseModel,
	user: BaseUser,
	objType,
	userType,
	isSelfResult?
) {
	if (obj instanceof Array) {
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
		if (isSelfResult === undefined) {
			isSelfResult = isSelf(obj, user, objType, userType);
		}

		const isAdminResult = isAdmin(user);

		// Loop through object members
		for (const member in obj) {
			if (!(obj[member] instanceof Function)) {
				const canWrite = getCanWrite(new objType(), member);

				if (canWrite === undefined) {
					if (member.indexOf('__') !== 0) {
						return member;
					}
				}
				else if (
					canWrite !== '__anyone__' &&
					((canWrite === '__self__' && !isSelfResult) ||
						(canWrite === '__admin__' && !isAdminResult))
				) {
					return member;
				}
			}
		}
	}

	return true;
}
