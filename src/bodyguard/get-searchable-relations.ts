import { getCanSearchRelation } from '../bodyguard';
import { BaseModel } from '../models';

/**
 * Get an array of searchable fields for the object
 * @param obj Object to receive keys for
 * @param user User object to check for permissions
 */
export function getSearchableRelations(obj: BaseModel): string[] {
	let searchableFields: string[] = [];

	for (const member in obj) {
		const canSearchRelation = getCanSearchRelation(obj, member);

		if (canSearchRelation) {
			const who = canSearchRelation.who;
			const fields = canSearchRelation.fields.map((field) => {
				return `${member}.${field}`;
			});

			searchableFields = searchableFields.concat(fields);
		}
	}

	return searchableFields;
}
