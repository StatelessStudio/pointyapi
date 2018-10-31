import { getCanSearch } from '../bodyguard';
import { BaseModel } from '../models';

/**
 * Get an array of searchable fields for the object
 * @param obj Object to receive keys for
 * @param user User object to check for permissions
 */
export function getSearchableFields(obj: BaseModel): string[] {
	const searchableFields: string[] = [];
	for (const member in obj) {
		if (getCanSearch(obj, member)) {
			searchableFields.push(member);
		}
	}

	return searchableFields;
}
