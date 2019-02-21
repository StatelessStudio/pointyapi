import { getCanReadRelation } from '../bodyguard';
import { BaseUser } from '../models';
import { BodyguardOwner, UserRole } from '../enums';

/**
 * Get readable relations for a payload, given a User
 * @param payload Object Payload object to check
 * @param user BaseUser User to authorize fields for
 * @param objAlias string (Optional) Object alias from a SQL query to prepend
 * 	to the member keys
 * @return string[] Returns an array of field names
 */
export function getReadableRelations(
	payload: Object,
	user: BaseUser,
	objAlias?: string
): string[] {
	const readableFields: string[] = [];

	// Traverse members of payload, and append the member to
	// readable fields if the CanRead() key allows
	for (let member in payload) {
		if (member && !(payload[member] instanceof Function)) {
			const canRead = getCanReadRelation(payload, member);

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
