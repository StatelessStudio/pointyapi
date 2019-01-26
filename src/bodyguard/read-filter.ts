import { BaseUser } from '../models';
import { getCanRead, isSelf, isAdmin } from '../bodyguard';

/**
 * Filter an outgoing response body to ensure it doesn't leak private fields
 * @param obj Object or array to check (enables recursion).
 * 	This can be the direct obj set of a typeorm request
 * @param user User object to check against
 * @param objType any Type of object to check
 * @param userType any Type of User to check
 * @return Returns the filtered obj
 */
export function readFilter(
	obj: any,
	user: BaseUser,
	objType: any,
	userType: any
): any {
	if (obj instanceof Array) {
		for (let i = 0; i < obj.length; i++) {
			obj[i] = readFilter(obj[i], user, objType, userType);
		}
	}
	else if (obj instanceof Object) {
		const isSelfResult = isSelf(obj, user, objType, userType);
		const isAdminResult = isAdmin(user);

		// Loop through object members
		for (const member in obj) {
			if (!(obj[member] instanceof Function)) {
				if (
					obj[member] instanceof Array ||
					(obj[member] instanceof Object &&
						!(obj[member] instanceof Date))
				) {
					const subObjTpye = obj[member].constructor;
					obj[member] = readFilter(
						obj[member],
						user,
						subObjTpye,
						userType
					);
				}
				else if (member !== 'id') {
					const canRead = getCanRead(new objType(), member);

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
		}
	}

	return obj;
}
