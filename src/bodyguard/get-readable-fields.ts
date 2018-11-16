import { getCanRead } from '../bodyguard';
import { BaseUser } from '../models';
import { UserRole } from '../enums/user-role';

export function getReadableFields(
	payload: Object,
	user: BaseUser,
	objName?: string
): string[] {
	const readableFields: string[] = [];

	for (let member in payload) {
		if (member && !(payload[member] instanceof Function)) {
			const canRead = getCanRead(payload, member);

			if (
				(canRead &&
					(canRead === '__anyone__' ||
						(user && canRead === user.role))) ||
				(canRead === '__self__' && user && user.id) ||
				(canRead === '__admin__' &&
					user &&
					user.role === UserRole.Admin)
			) {
				member = objName ? objName + '.' + member : member;

				readableFields.push(member);
			}
		}
	}

	return readableFields;
}
