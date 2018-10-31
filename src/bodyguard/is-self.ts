import { BaseModel, BaseUser } from '../models';
import { UserRole } from '../enums';
import { getBodyguardKeys } from './get-bodyguard-keys';
import { compareNestedBodyguards } from './compare-nested';

/**
 * Check if the user matches a BodyguardKey for the obj object
 * @param obj Object to check
 * @param user User to check for matching BodyguardKey
 */
export function isSelf(obj: BaseModel, user: BaseUser) {
	if (!user) {
		return false;
	}

	const objBodyguardKeys = getBodyguardKeys(obj);
	const userBodyguardKeys = getBodyguardKeys(user);

	const objConstructor = Object.getPrototypeOf(obj).constructor;
	const userConstructor = Object.getPrototypeOf(user).constructor;

	if (user) {
		if (user.role === UserRole.Admin) {
			return true;
		}

		// Check if obj is of user type
		if (objConstructor === userConstructor) {
			// Object is of type user
			for (const key of userBodyguardKeys) {
				if (
					obj[key] !== undefined &&
					`${obj[key]}` === `${user[key]}`
				) {
					return true;
				}
			}
		}
		else {
			// Object is not of type user
			return compareNestedBodyguards(
				obj,
				user,
				objBodyguardKeys,
				userBodyguardKeys
			);
		}
	}

	return false;
}