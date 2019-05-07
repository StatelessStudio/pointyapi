import { getSearchableFields, getSearchableRelations } from '../bodyguard';
import { BaseModelInterface } from '../models/base-model';

/**
 * Create a SQL query string for a search
 * @param payloadType Request payload type
 * @param obj Search query object
 * @param objKey SQL query object alias. Default is `obj`
 * @return Returns { queryString, queryParams }
 */
export function createSearchQuery(
	payloadType: BaseModelInterface,
	obj: Object,
	objKey: string = 'obj'
): any {
	let queryString = '';
	const queryParams = {};

	for (const field in obj) {
		if (field && field === 'where') {
			queryString += '(';

			// Loop through any of keys
			for (const whereKey in obj['where']) {
				// Append key to queryString
				queryString += `${objKey}.${whereKey}=:${whereKey} AND `;

				// Append parameter to queryParams
				queryParams[whereKey] = `${obj['where'][whereKey]}`;
			}

			queryString = queryString.replace(/ AND +$/, '');
			queryString += ') AND ';
		}
		else if (field && field === 'whereAnyOf') {
			queryString += '(';

			// Loop through any of keys
			for (const anyOfKey in obj['whereAnyOf']) {
				// Append key to queryString
				queryString += `${objKey}.${anyOfKey}=:${anyOfKey} OR `;

				// Append parameter to queryParams
				queryParams[anyOfKey] = `${obj['whereAnyOf'][anyOfKey]}`;
			}

			queryString = queryString.replace(/ OR +$/, '');
			queryString += ') AND ';
		}
		else if (field && field === 'search') {
			const ptype = new payloadType();

			const searchableFields = getSearchableFields(ptype);
			const searchableRelations = getSearchableRelations(ptype);

			queryString += '(';

			if (typeof obj[field] === 'string') {
				searchableFields.forEach((key) => {
					// Append searchable key to queryString
					queryString += `LOWER(${objKey}.${key}) LIKE :search OR `;

					// Append parameter to queryParams (with wildcards)
					const value = obj['search']
						.replace(/[\s]+/, '%')
						.toLowerCase();
					queryParams['search'] = `%${value}%`;
				});

				searchableRelations.forEach((key) => {
					// Append searchable key to queryString
					queryString += `LOWER(${key}) LIKE :search OR `;

					// Append parameter to queryParams (with wildcards)
					const value = obj['search']
						.replace(/[\s]+/, '%')
						.toLowerCase();
					queryParams['search'] = `%${value}%`;
				});
			}
			else if (typeof obj[field] === 'object') {
				for (const key in obj[field]) {
					// Append searchable key to queryString
					queryString += `LOWER(${objKey}.${key}) LIKE :search_${key} OR `;

					// Append parameter to queryParams (with wildcards)
					const value = obj[field][key]
						.replace(/[\s]+/, '%')
						.toLowerCase();
					queryParams['search_' + key] = `%${value}%`;
				}
			}

			queryString = queryString.replace(/ OR +$/, '');
			queryString += ') AND ';
		}
		else if (field && field === 'between') {
			for (const betweenKey in obj['between']) {
				const range = obj['between'][betweenKey];

				// Range should be an array of two
				if ('length' in range && range.length === 2) {
					// Range should be int
					range.map((val) => {
						return parseInt(val, 10);
					});

					// Append key to queryString
					queryString +=
						`(${objKey}.${betweenKey} BETWEEN ` +
						range[0] +
						' AND ' +
						range[1] +
						') AND ';
				}
			}
		}
		else if (field && field === 'lessThan') {
			for (const lessThanKey in obj['lessThan']) {
				// Append key to queryString
				queryString += `${objKey}.${lessThanKey} < :${lessThanKey} AND `;

				// Append parameter to queryParams
				queryParams[lessThanKey] = `${obj['lessThan'][lessThanKey]}`;
			}
		}
		else if (field && field === 'greaterThan') {
			for (const greaterThanKey in obj['greaterThan']) {
				// Append key to queryString
				queryString += `${objKey}.${greaterThanKey} > :${greaterThanKey} AND `;

				// Append parameter to queryParams
				queryParams[greaterThanKey] = `${obj['greaterThan'][
					greaterThanKey
				]}`;
			}
		}
		else if (field && field === 'lessThanOrEqual') {
			for (const lessThanOrEqualKey in obj['lessThanOrEqual']) {
				// Append key to queryString
				queryString +=
					`${objKey}.${lessThanOrEqualKey} <= ` +
					`:${lessThanOrEqualKey} AND `;

				// Append parameter to queryParams
				queryParams[lessThanOrEqualKey] = `${obj['lessThanOrEqual'][
					lessThanOrEqualKey
				]}`;
			}
		}
		else if (field && field === 'greaterThanOrEqual') {
			for (const greaterThanOrEqualKey in obj['greaterThanOrEqual']) {
				// Append key to queryString
				queryString +=
					`${objKey}.${greaterThanOrEqualKey} >= ` +
					`:${greaterThanOrEqualKey} AND `;

				// Append parameter to queryParams
				queryParams[greaterThanOrEqualKey] = `${obj[
					'greaterThanOrEqual'
				][greaterThanOrEqualKey]}`;
			}
		}
		else if (field && field === 'not') {
			for (const notKey in obj['not']) {
				// Append key to queryString
				queryString += `${objKey}.${notKey}!=:${notKey} AND `;

				// Append parameter to queryParams
				queryParams[notKey] = `${obj['not'][notKey]}`;
			}
		}
	}

	queryString = queryString.replace(/ AND +$/, '');

	return { queryString, queryParams };
}
