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
	for (let member in payload) {
		if (member && !(payload[member] instanceof Function)) {
			const canRead = getCanRead(payload, member);

			if (
				(canRead &&
					(canRead === BodyguardOwner.Anyone ||
						(user && canRead === user.role))) ||
				(canRead === BodyguardOwner.Self && user && user.id) ||
				((canRead === BodyguardOwner.Admin ||
					canRead === BodyguardOwner.Self) &&
					user &&
					user.role === UserRole.Admin)
			) {
				member = objAlias ? objAlias + '.' + member : member;

				readableFields.push(member);
			}
		}
	}

	// Return readable fields
	return readableFields;
}
