import { getCanRead } from '../bodyguard';
import { BaseUser } from '../models';
import { BodyguardOwner, UserRole } from '../enums';

/**
 * Get readable fields for a payload, given a User
 * @param payload Payload object to check
 * @param user User to authorize fields for
 * @param objAlias Object alias from a SQL query to prepend
 * 	to the member keys
 * @return Returns an array of field names
 */
export function getReadableFields(
	payload: Object,
	user: BaseUser,
	objAlias?: string
): string[] {
	const readableFields: string[] = [];

	// Traverse members of payload, and append the member to
	// readable fields if the CanRead() key allows
	for (const member in payload) {
		if (member && !(payload[member] instanceof Function)) {
			const canRead = getCanRead(payload, member);

			// Check if the key has a CanRead() decorator, and if it equals Anyone
			// Exceptions:
			// 	a. The CanRead() key is a UserRole that is equivalent to the User's role
			//  b. The CanRead() key is set to Self and the user is authenticated (we'll filter later)
			// 	c. The CanRead() key is set to Admin and the user is an admin
			if (
				canRead && // must have CanRead() key
				(canRead === BodyguardOwner.Anyone || // Anyone
				(user && canRead === user.role) || // By role
				(user && canRead === BodyguardOwner.Self && user.id) || // Self
					(user && // Admin
						canRead === BodyguardOwner.Admin &&
						user.role === UserRole.Admin))
			) {
				readableFields.push(
					objAlias ? objAlias + '.' + member : member
				);
			}
		}
	}

	// Return readable fields
	return readableFields;
}
