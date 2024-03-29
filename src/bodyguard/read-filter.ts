import {
	BaseModel,
	BaseModelInterface,
	BaseUser,
	BaseUserInterface,
} from '../models';
import { getCanRead } from '../bodyguard';
import { isSelf, isAdmin } from '../utils';
import { BodyguardOwner } from '../enums';

/**
 * Filter an outgoing response body to ensure it doesn't leak private fields
 * @param obj Object or array to check (enables recursion).
 * 	This can be the direct obj set of a typeorm request
 * @param user User object to check against
 * @param objType Type of object to check
 * @param userType Type of User to check
 * @return Returns the filtered obj
 */
export function readFilter<T extends BaseModel | BaseModel[]>(
	obj: T,
	user: BaseUser,
	objType: BaseModelInterface,
	userType: BaseUserInterface,
): T {
	if (obj instanceof Array) {
		for (let i = 0; i < obj.length; i++) {
			const subObjType = <BaseModelInterface>obj[i].constructor;
			obj[i] = readFilter(obj[i], user, subObjType, userType);
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
					const subObjType = obj[member].constructor;

					if (subObjType !== {}.constructor) {
						obj[member] = readFilter(
							obj[member],
							user,
							<BaseModelInterface>subObjType,
							userType
						);
					}
				}
				else if (member !== 'id') {
					const canRead = getCanRead(new objType(), member);

					if (canRead === undefined) {
						delete obj[member];
					}
					else if (
						canRead !== BodyguardOwner.Anyone &&
						((canRead === BodyguardOwner.Self && !isSelfResult) ||
							(canRead === BodyguardOwner.Admin &&
								!isAdminResult))
					) {
						delete obj[member];
					}
				}
			}
		}
	}

	return obj;
}
