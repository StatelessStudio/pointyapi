import { BaseUserInterface } from '../models';

/**
 * Compare bodyguard keys of a user against an identifier/value pair to see if
 * 	they match
 * @param identifier Identifier field name
 * @param value Identifier field value
 * @param user User to check
 * @param userBodyguardKeys Array of user type bodyguard keys to check
 * @return Returns if the identifier is a valid bodyguard key and that
 * 	it also matches the user's key
 */
export function compareIdToUser(
	identifier: string,
	value: number | string,
	user: BaseUserInterface,
	userBodyguardKeys: string[]
): boolean {
	return userBodyguardKeys.includes(identifier) && value === user[identifier];
}
