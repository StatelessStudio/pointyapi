import { BaseModel, BaseUser } from '../models';

function isDefined(a) {
	return a !== undefined && a !== null;
}

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
				isDefined(obj[objKey]) &&
				isDefined(obj[objKey][userKey]) &&
				`${obj[objKey][userKey]}` === `${user[userKey]}`
			) {
				return true;
			}
		}
	}

	return false;
}
