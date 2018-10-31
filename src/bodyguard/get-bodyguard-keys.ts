import { isBodyguardKey } from '../bodyguard';
import { BaseModel } from '../models';

/**
 * Get an array of BodyguardKeys for the object
 * @param obj Object to receive keys for
 * @return Returns an array of keys
 */
export function getBodyguardKeys(obj: BaseModel): string[] {
	const ownerKeys: string[] = [];
	for (const member in obj) {
		if (isBodyguardKey(obj, member)) {
			ownerKeys.push(member);
		}
	}

	if (!ownerKeys.length) {
		throw new Error('Object has no bodyguard keys');
	}

	return ownerKeys;
}
