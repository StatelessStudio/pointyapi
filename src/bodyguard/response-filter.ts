import { BaseUser } from '../models';
import { getCanRead, isSelf, isAdmin } from '../bodyguard';

/**
 * Filter an outgoing response body to ensure it doesn't leak private fields
 * @param obj Object or array to check (enables recursion).
 * 	This can be the direct obj set of a typeorm request
 * @param user User object to check against
 * @return Returns the filtered obj
 */
export function responseFilter(obj: any, user: BaseUser) {
	if (obj instanceof Array) {
		for (let i = 0; i < obj.length; i++) {
			obj[i] = responseFilter(obj[i], user);
		}
	}
	else if (obj instanceof Object) {
		const isSelfResult = isSelf(obj, user);
		const isAdminResult = isAdmin(user);

		// Loop through object members
		for (const member in obj) {
			const canRead = getCanRead(obj, member);

			if (canRead === undefined) {
				delete obj[member];
			}
			else if (
				canRead !== '__anyone__' &&
				((canRead === '__self__' && !isSelfResult) ||
					(canRead === '__admin__' && !isAdminResult))
			) {
				delete obj[member];
			}
		}
	}

	return obj;
}