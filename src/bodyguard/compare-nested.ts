import { BaseModel, BaseUser } from '../models';
import { isDefined } from '../utils';

/**
 * Compare a nested User against a User for ownership
 * 	Example: Does obj->owner->id equal user->id?
 * @param obj Object to test
 * @param user User to test
 * @param objBodyguardKeys Key array from getBodyguardKeys(obj)
 * @param userBodyguardKeys Key array from getBodyguardKeys(user)
 * @return Returns if the user owns the given object
 */
export function compareNestedBodyguards(
	obj: BaseModel,
	user: BaseUser,
	objBodyguardKeys: string[],
	userBodyguardKeys: string[]
): boolean {
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
