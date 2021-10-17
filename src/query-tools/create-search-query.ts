import { getSearchableFields, getSearchableRelations } from '../bodyguard';
import { BaseModelInterface } from '../models/base-model';
import { Query } from './query';

/**
 * Create a SQL query string for a search
 * @param payloadType Request payload type
 * @param query Search query object
 * @param objKey SQL query object alias. Default is `obj`
 * @return Returns { queryString, queryParams }
 */
export function createSearchQuery(
	payloadType: BaseModelInterface,
	query: Query,
	objKey: string = 'obj'
): any {
	let queryString = '';
	const queryParams = {};

	for (const queryType in query) {
		if (queryType === 'where') {
			queryString += '(';

			// Loop through any of keys
			for (const whereKey in query.where) {
				const key = 'where_' + whereKey;

				// Append key to queryString
				queryString += `${objKey}.${whereKey}=:${key} AND `;

				// Append parameter to queryParams
				queryParams[key] = `${query.where[whereKey]}`;
			}

			queryString = queryString.replace(/ AND +$/, '');
			queryString += ') AND ';
		}
		else if (queryType === 'whereAnyOf') {
			queryString += '(';

			// Loop through any of keys
			for (const anyOfKey in query.whereAnyOf) {
				const key = 'whereAnyOf_' + anyOfKey;

				// Append key to queryString
				queryString += `${objKey}.${anyOfKey}=:${key} OR `;

				// Append parameter to queryParams
				queryParams[key] = `${query.whereAnyOf[anyOfKey]}`;
			}

			queryString = queryString.replace(/ OR +$/, '');
			queryString += ') AND ';
		}
		else if (queryType === 'search') {
			const ptype = new payloadType();

			const searchableFields = getSearchableFields(ptype);
			const searchableRelations = getSearchableRelations(ptype);

			queryString += '(';

			if (typeof query.search === 'string') {
				const searchString = query.search as string;

				searchableFields.forEach((key) => {
					// Append searchable key to queryString
					queryString += `LOWER(${objKey}.${key}) LIKE :search OR `;

					// Append parameter to queryParams (with wildcards)
					const value = searchString
						.replace(/[\s]+/, '%')
						.toLowerCase();
					queryParams['search'] = `%${value}%`;
				});

				searchableRelations.forEach((key) => {
					// Append searchable key to queryString
					queryString += `LOWER(${key}) LIKE :search OR `;

					// Append parameter to queryParams (with wildcards)
					const value = searchString
						.replace(/[\s]+/, '%')
						.toLowerCase();
					queryParams['search'] = `%${value}%`;
				});
			}
			else if (typeof query.search === 'object') {
				for (const key in query.search) {
					// Append searchable key to queryString
					queryString += `LOWER(${objKey}.${key}) LIKE :search_${key} OR `;

					// Append parameter to queryParams (with wildcards)
					const value = query.search[key]
						.replace(/[\s]+/, '%')
						.toLowerCase();
					queryParams['search_' + key] = `%${value}%`;
				}
			}

			queryString = queryString.replace(/ OR +$/, '');
			queryString += ') AND ';
		}
		else if (queryType === 'between') {
			for (const betweenKey in query.between) {
				const range = query.between[betweenKey];

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
			for (const lessThanKey in query.lessThan) {
				const key = 'lessThan_' + lessThanKey;
				// Append key to queryString
				queryString += `${objKey}.${lessThanKey} < :${key} AND `;

				// Append parameter to queryParams
				queryParams[key] = `${query.lessThan[lessThanKey]}`;
			}
		}
		else if (queryType === 'greaterThan') {
			for (const greaterThanKey in query.greaterThan) {
				const key = 'greaterThan_' + greaterThanKey;

				// Append key to queryString
				queryString += `${objKey}.${greaterThanKey} > :${key} AND `;

				// Append parameter to queryParams
				queryParams[key] = `${query.greaterThan[
					greaterThanKey
				]}`;
			}
		}
		else if (queryType === 'lessThanOrEqual') {
			for (const lessThanOrEqualKey in query.lessThanOrEqual) {
				const key = 'lessThanOrEqual_' + lessThanOrEqualKey;

				// Append key to queryString
				queryString +=
					`${objKey}.${lessThanOrEqualKey} <= ` +
					`:${key} AND `;

				// Append parameter to queryParams
				queryParams[key] = `${query.lessThanOrEqual[
					lessThanOrEqualKey
				]}`;
			}
		}
		else if (queryType === 'greaterThanOrEqual') {
			for (const greaterThanOrEqualKey in query.greaterThanOrEqual) {
				const key = 'greaterThanOrEqual_' + greaterThanOrEqualKey;

				// Append key to queryString
				queryString +=
					`${objKey}.${greaterThanOrEqualKey} >= ` +
					`:${key} AND `;

				// Append parameter to queryParams
				queryParams[key] = `${query.greaterThanOrEqual[greaterThanOrEqualKey]}`;
			}
		}
		else if (queryType === 'not') {
			for (const notKey in query.not) {
				const key = 'not_' + notKey;

				// Append key to queryString
				queryString += `${objKey}.${notKey}!=:${key} AND `;

				// Append parameter to queryParams
				queryParams[key] = `${query.not[notKey]}`;
			}
		}
	}

	queryString = queryString.replace(/ AND +$/, '');

	return { queryString, queryParams };
}
