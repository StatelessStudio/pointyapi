import { getSearchableFields, getSearchableRelations } from '../bodyguard';

/**
 * Create a SQL query string for a search
 * @param payloadType any Request payload type
 * @param obj Object Search query object
 * @param objKey string (Optional) SQL query object alias
 * @return Object Returns { queryString, queryParams }
 */
export function createSearchQuery(
	payloadType,
	obj: Object,
	objKey: string = 'obj'
): any {
	const searchableFields = getSearchableFields(payloadType);
	const searchableRelations = getSearchableRelations(payloadType);
	let queryString = '';
	const queryParams = {};
	const hasSearchable = searchableFields.length;
	const hasAdditional = Object.keys(obj).length > 1;

	// Join strings
	if (hasSearchable && hasAdditional) {
		queryString += '(';
	}

	// Searchable strings
	if (hasSearchable) {
		queryString += '(';
		searchableFields.forEach((field) => {
			// Append searchable key to queryString
			queryString += `${objKey}.${field} LIKE :__search OR `;

			// Append parameter to queryParams (with wildcards)
			const value = obj['__search'].replace(/[\s]+/, '%');
			queryParams['__search'] = `%${value}%`;
		});

		searchableRelations.forEach((field) => {
			// Append searchable key to queryString
			queryString += `${field} LIKE :__search OR `;

			// Append parameter to queryParams (with wildcards)
			const value = obj['__search'].replace(/[\s]+/, '%');
			queryParams['__search'] = `%${value}%`;
		});

		queryString = queryString.replace(/ OR +$/, '');
		queryString += ')';
	}

	// Join strings
	if (hasSearchable && hasAdditional) {
		queryString += ' AND ';
	}

	// Additional parameters
	if (hasAdditional) {
		queryString += '(';

		for (const field in obj) {
			if (
				field &&
				field.indexOf('__') !== 0 &&
				!(obj[field] instanceof Function)
			) {
				// Append key to queryString
				queryString += `${objKey}.${field}=:${field} AND `;

				// Append parameter to queryParams
				queryParams[field] = `${obj[field]}`;
			}
			else if (field && field === '__whereAnyOf') {
				queryString += '(';

				// Loop through any of keys
				for (const anyOfKey in obj['__whereAnyOf']) {
					// Append key to queryString
					queryString += `${objKey}.${anyOfKey}=:${anyOfKey} OR `;

					// Append parameter to queryParams
					queryParams[anyOfKey] = `${obj['__whereAnyOf'][anyOfKey]}`;
				}

				queryString = queryString.replace(/ OR +$/, '');
				queryString += ') AND ';
			}
			else if (field && field === '__between') {
				for (const betweenKey in obj['__between']) {
					const range = obj['__between'][betweenKey];

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
			else if (field && field === '__lessThan') {
				for (const lessThanKey in obj['__lessThan']) {
					// Append key to queryString
					queryString += `${objKey}.${lessThanKey} < :${lessThanKey} AND `;

					// Append parameter to queryParams
					queryParams[lessThanKey] = `${obj['__lessThan'][
						lessThanKey
					]}`;
				}
			}
			else if (field && field === '__greaterThan') {
				for (const greaterThanKey in obj['__greaterThan']) {
					// Append key to queryString
					queryString += `${objKey}.${greaterThanKey} > :${greaterThanKey} AND `;

					// Append parameter to queryParams
					queryParams[greaterThanKey] = `${obj['__greaterThan'][
						greaterThanKey
					]}`;
				}
			}
			else if (field && field === '__lessThanOrEqual') {
				for (const lessThanOrEqualKey in obj['__lessThanOrEqual']) {
					// Append key to queryString
					queryString +=
						`${objKey}.${lessThanOrEqualKey} <= ` +
						`:${lessThanOrEqualKey} AND `;

					// Append parameter to queryParams
					queryParams[lessThanOrEqualKey] = `${obj[
						'__lessThanOrEqual'
					][lessThanOrEqualKey]}`;
				}
			}
			else if (field && field === '__greaterThanOrEqual') {
				for (const greaterThanOrEqualKey in obj[
					'__greaterThanOrEqual'
				]) {
					// Append key to queryString
					queryString +=
						`${objKey}.${greaterThanOrEqualKey} >= ` +
						`:${greaterThanOrEqualKey} AND `;

					// Append parameter to queryParams
					queryParams[greaterThanOrEqualKey] = `${obj[
						'__greaterThanOrEqual'
					][greaterThanOrEqualKey]}`;
				}
			}
			else if (field && field === '__not') {
				for (const notKey in obj['__not']) {
					// Append key to queryString
					queryString += `${objKey}.${notKey}!=:${notKey} AND `;

					// Append parameter to queryParams
					queryParams[notKey] = `${obj['__not'][notKey]}`;
				}
			}
		}

		queryString = queryString.replace(/ AND +$/, '');
		queryString += ')';
	}

	// Join strings
	if (hasSearchable && hasAdditional) {
		queryString += ')';
	}

	return { queryString, queryParams };
}
