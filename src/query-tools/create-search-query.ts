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
			for (const column in query.where) {
				const key = 'where_' + column;

				queryString += `${objKey}.${column}=:${key} AND `;
				queryParams[key] = `${query.where[column]}`;
			}
		}
		else if (queryType === 'whereAnyOf') {
			queryString += '(';

			for (const column in query.whereAnyOf) {
				const key = 'whereAnyOf_' + column;

				queryString += `${objKey}.${column}=:${key} OR `;
				queryParams[key] = `${query.whereAnyOf[column]}`;
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

				searchableFields.forEach((column) => {
					// Append searchable key to queryString
					queryString += `LOWER(${objKey}.${column}) LIKE :search OR `;

					// Append parameter to queryParams (with wildcards)
					const value = searchString
						.replace(/[\s]+/, '%')
						.toLowerCase();
					queryParams['search'] = `%${value}%`;
				});

				searchableRelations.forEach((column) => {
					// Append searchable key to queryString
					queryString += `LOWER(${column}) LIKE :search OR `;

					// Append parameter to queryParams (with wildcards)
					const value = searchString
						.replace(/[\s]+/, '%')
						.toLowerCase();
					queryParams['search'] = `%${value}%`;
				});
			}
			else if (typeof query.search === 'object') {
				for (const column in query.search) {
					const key = 'search_' + column;

					// Append searchable key to queryString
					queryString += `LOWER(${objKey}.${column}) LIKE :${key} OR `;

					// Append parameter to queryParams (with wildcards)
					const value = query.search[column]
						.replace(/[\s]+/, '%')
						.toLowerCase();
					queryParams[key] = `%${value}%`;
				}
			}

			queryString = queryString.replace(/ OR +$/, '');
			queryString += ') AND ';
		}
		else if (queryType === 'between') {
			for (const column in query.between) {
				const range = query.between[column];

				// Range should be an array of two
				if ('length' in range && range.length === 2) {
					const key = 'between_' + column;
					const key1 = key + '1';
					const key2 = key + '2';

					// Range should be int
					range.map((val) => {
						return parseInt(val, 10);
					});

					// Append key to queryString
					queryString += `(${objKey}.${column} BETWEEN ` +
						`:${key1} AND :${key2}) AND `;

					queryParams[key1] = range[0];
					queryParams[key2] = range[1];
				}
			}
		}
		else if (queryType === 'lessThan') {
			for (const column in query.lessThan) {
				const key = 'lt_' + column;

				// Append key to queryString
				queryString += `${objKey}.${column} < :${key} AND `;
				queryParams[key] = `${query.lessThan[column]}`;
			}
		}
		else if (queryType === 'greaterThan') {
			for (const column in query.greaterThan) {
				const key = 'gt_' + column;

				queryString += `${objKey}.${column} > :${key} AND `;
				queryParams[key] = `${query.greaterThan[column]}`;
			}
		}
		else if (queryType === 'lessThanOrEqual') {
			for (const column in query.lessThanOrEqual) {
				const key = 'lte_' + column;

				queryString +=
					`${objKey}.${column} <= ` +
					`:${key} AND `;

				queryParams[key] = `${query.lessThanOrEqual[column]}`;
			}
		}
		else if (queryType === 'greaterThanOrEqual') {
			for (const column in query.greaterThanOrEqual) {
				const key = 'gte_' + column;

				queryString +=
					`${objKey}.${column} >= ` +
					`:${key} AND `;

				queryParams[key] = `${query.greaterThanOrEqual[column]}`;
			}
		}
		else if (queryType === 'not') {
			for (const column in query.not) {
				const key = 'not_' + column;

				queryString += `${objKey}.${column}!=:${key} AND `;
				queryParams[key] = `${query.not[column]}`;
			}
		}
	}

	queryString = queryString.replace(/ AND +$/, '');

	return { queryString, queryParams };
}
