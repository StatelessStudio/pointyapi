import { BaseModel, BaseUser } from '../models';
import { UserRole } from '../enums';
import { getBodyguardKeys } from './get-bodyguard-keys';
import { compareNestedBodyguards } from './compare-nested';

/**
 * Check if the user matches a BodyguardKey for the object
 * @param obj Object to check
 * @param user User to check for matching BodyguardKey
 * @return boolean Returns if the user owns this object
 */
export function isSelf(
	obj: BaseModel | BaseModel[],
	user: BaseUser,
	objType: any,
	userType: any,
	objBodyguardKeys?: string[],
	userBodyguardKeys?: string[]
): boolean {
	if (obj instanceof Array) {
		// Recurse array of objects
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
		// Get bodyguard keys for object and user
		if (objBodyguardKeys === undefined) {
			objBodyguardKeys = getBodyguardKeys(new objType());
		}

		if (userBodyguardKeys === undefined) {
			userBodyguardKeys = getBodyguardKeys(new userType());
		}

		// Check user
		if (user) {
			// Admins pass isSelf regardless of user
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

				// Check nested bodyguard keys
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
