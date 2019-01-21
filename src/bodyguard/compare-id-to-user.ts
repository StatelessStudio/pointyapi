import { BaseUser } from '../models';

/**
 * Compare bodyguard keys against request.params for ownership
 * @param request Express Request object
 * @param userBodyguardKeys Array of bodyguard keys from getBodyguardKeys()
 * @param routeParam Route paramaters
 */
export function compareIdToUser(
	identifier: string,
	value: number | string,
	user: BaseUser,
	userBodyguardKeys: string[]
) {
	for (const userKey of userBodyguardKeys) {
		if (
			value !== undefined &&
			identifier === userKey &&
			`${value}` === `${user[userKey]}`
		) {
			return true;
		}
	}

	return false;
}
