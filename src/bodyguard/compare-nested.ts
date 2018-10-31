import { BaseModel, BaseUser } from '../models';

/**
 * Compare a model with nested User models against the user
 * 	for ownership
 * @param obj Object to test
 * @param user User to test
 * @param objBodyguardKeys Key array from getBodyguardKeys(obj)
 * @param userBodyguardKeys Key array from getBodyguardKeys(user)
 */

export function compareNestedBodyguards(
	obj: BaseModel,
	user: BaseUser,
	objBodyguardKeys: string[],
	userBodyguardKeys: string[]
) {
	for (const objKey of objBodyguardKeys) {
		for (const userKey of userBodyguardKeys) {
			if (
				obj[objKey] !== undefined &&
				obj[objKey][userKey] !== undefined &&
				`${obj[objKey][userKey]}` === `${user[userKey]}`
			) {
				return true;
			}
		}
	}

	return false;
}
