import { BaseUserInterface } from '../models';

/**
 * Compare bodyguard keys of a user against an identifier/value pair to see if
 * 	they match
 * @param identifier string Identifier field name
 * @param value number | string Identifier field value
 * @param user BaseUserInterface User to check
 * @param userBodyguardKeys string[] Array of user type bodyguard keys to check
 * @return boolean Returns if the identifier is a valid bodyguard key and that
 * 	it also matches the user's key
 */
export function compareIdToUser(
	identifier: string,
	value: number | string,
	user: BaseUserInterface,
	userBodyguardKeys: string[]
): boolean {
	// Traverse bodyguard keys, and check if it matches
	// TODO: This should be able to be done without looping to reduce runtime
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
