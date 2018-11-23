import { BaseModel, BaseUser } from '../models';
import { UserRole } from '../enums';
import { getBodyguardKeys } from './get-bodyguard-keys';
import { compareNestedBodyguards } from './compare-nested';

/**
 * Check if the user matches a BodyguardKey for the obj object
 * @param obj Object to check
 * @param user User to check for matching BodyguardKey
 */
export function isSelf(
	obj: BaseModel | BaseModel[],
	user: BaseUser,
	objType,
	userType,
	objBodyguardKeys?: string[],
	userBodyguardKeys?: string[]
) {
	if (obj instanceof Array) {
		for (let i = 0; i < obj.length; i++) {
			if (
				!isSelf(
					obj[i],
					user,
					objType,
					userType,
					objBodyguardKeys,
					userBodyguardKeys
				)
			) {
				return false;
			}
		}

		return true;
	}
	else {
		if (objBodyguardKeys === undefined) {
			objBodyguardKeys = getBodyguardKeys(new objType());
			userBodyguardKeys = getBodyguardKeys(new userType());
		}

		if (!user) {
			return false;
		}

		if (user) {
			if (user.role === UserRole.Admin) {
				return true;
			}

			// Check if obj is of user type
			if (objType === userType) {
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
}
