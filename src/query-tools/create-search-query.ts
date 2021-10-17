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

	for (const queryType in obj) {
		if (queryType === 'where') {
			queryString += '(';

			// Loop through any of keys
			for (const whereKey in obj['where']) {
				const key = 'where_' + whereKey;

				// Append key to queryString
				queryString += `${objKey}.${whereKey}=:${key} AND `;

				// Append parameter to queryParams
				queryParams[key] = `${obj['where'][whereKey]}`;
			}

			queryString = queryString.replace(/ AND +$/, '');
			queryString += ') AND ';
		}
		else if (queryType === 'whereAnyOf') {
			queryString += '(';

			// Loop through any of keys
			for (const anyOfKey in obj['whereAnyOf']) {
				const key = 'whereAnyOf_' + anyOfKey;

				// Append key to queryString
				queryString += `${objKey}.${anyOfKey}=:${key} OR `;

				// Append parameter to queryParams
				queryParams[key] = `${obj['whereAnyOf'][anyOfKey]}`;
			}

			queryString = queryString.replace(/ OR +$/, '');
			queryString += ') AND ';
		}
		else if (queryType === 'search') {
			const ptype = new payloadType();

			const searchableFields = getSearchableFields(ptype);
			const searchableRelations = getSearchableRelations(ptype);

			queryString += '(';

			if (typeof obj[queryType] === 'string') {
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
			else if (typeof obj[queryType] === 'object') {
				for (const key in obj[queryType]) {
					// Append searchable key to queryString
					queryString += `LOWER(${objKey}.${key}) LIKE :search_${key} OR `;

					// Append parameter to queryParams (with wildcards)
					const value = obj[queryType][key]
						.replace(/[\s]+/, '%')
						.toLowerCase();
					queryParams['search_' + key] = `%${value}%`;
				}
			}

			queryString = queryString.replace(/ OR +$/, '');
			queryString += ') AND ';
		}
		else if (queryType === 'between') {
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
		else if (queryType === 'lessThan') {
			for (const lessThanKey in obj['lessThan']) {
				const key = 'lessThan_' + lessThanKey;
				// Append key to queryString
				queryString += `${objKey}.${lessThanKey} < :${key} AND `;

				// Append parameter to queryParams
				queryParams[key] = `${obj['lessThan'][lessThanKey]}`;
			}
		}
		else if (queryType === 'greaterThan') {
			for (const greaterThanKey in obj['greaterThan']) {
				const key = 'greaterThan_' + greaterThanKey;

				// Append key to queryString
				queryString += `${objKey}.${greaterThanKey} > :${key} AND `;

				// Append parameter to queryParams
				queryParams[key] = `${obj['greaterThan'][
					greaterThanKey
				]}`;
			}
		}
		else if (queryType === 'lessThanOrEqual') {
			for (const lessThanOrEqualKey in obj['lessThanOrEqual']) {
				const key = 'lessThanOrEqual_' + lessThanOrEqualKey;

				// Append key to queryString
				queryString +=
					`${objKey}.${lessThanOrEqualKey} <= ` +
					`:${key} AND `;

				// Append parameter to queryParams
				queryParams[key] = `${obj['lessThanOrEqual'][
					lessThanOrEqualKey
				]}`;
			}
		}
		else if (queryType === 'greaterThanOrEqual') {
			for (const greaterThanOrEqualKey in obj['greaterThanOrEqual']) {
				const key = 'greaterThanOrEqual_' + greaterThanOrEqualKey;

				// Append key to queryString
				queryString +=
					`${objKey}.${greaterThanOrEqualKey} >= ` +
					`:${key} AND `;

				// Append parameter to queryParams
				queryParams[key] = `${obj[
					'greaterThanOrEqual'
				][greaterThanOrEqualKey]}`;
			}
		}
		else if (queryType === 'not') {
			for (const notKey in obj['not']) {
				const key = 'not_' + notKey;

				// Append key to queryString
				queryString += `${objKey}.${notKey}!=:${key} AND `;

				// Append parameter to queryParams
				queryParams[key] = `${obj['not'][notKey]}`;
			}
		}
	}

	queryString = queryString.replace(/ AND +$/, '');

	return { queryString, queryParams };
}
