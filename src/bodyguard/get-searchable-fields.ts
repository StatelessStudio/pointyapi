import { getCanSearch } from '../bodyguard';
import { BaseModel } from '../models';

/**
 * Get an array of searchable fields for the object
 * @param obj Object to receive keys for
 * @return Returns array of field names
 */
export function getSearchableFields(obj: BaseModel): string[] {
	const searchableFields: string[] = [];

	// Traverse members of object, and append CanSearch() keys
	// to searchableFields
	for (const member in obj) {
		if (getCanSearch(obj, member)) {
			searchableFields.push(member);
		}
	}

	// Return searchable fields
	return searchableFields;
}
