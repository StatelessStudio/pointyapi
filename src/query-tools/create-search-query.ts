import { getSearchableFields, getSearchableRelations } from '../bodyguard';
import { BaseModelInterface } from '../models/base-model';
import { Query } from './query';
import { QueryColumnReference } from './query-column-reference';

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
				const val = query.where[column];
				const ref = new QueryColumnReference(val, objKey);

				if (ref.isReference) {
					queryString += `${objKey}.${column}=${ref.str()} AND `;
				}
				else {
					const key = 'where_' + column;

					queryString += `${objKey}.${column}=:${key} AND `;
					queryParams[key] = `${val}`;
				}
			}
		}
		else if (queryType === 'whereAnyOf') {
			queryString += '(';

			for (const column in query.whereAnyOf) {
				const val = query.whereAnyOf[column];
				const ref = new QueryColumnReference(val, objKey);

				if (ref.isReference) {
					queryString += `${objKey}.${column}=${ref.str()} OR `;
				}
				else {
					const key = 'whereAnyOf_' + column;

					queryString += `${objKey}.${column}=:${key} OR `;
					queryParams[key] = `${val}`;
				}
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
					queryString += `(${objKey}.${column} BETWEEN `;

					for (let i = 0; i < 2; i++) {
						const val = range[i];
						const ref = new QueryColumnReference(val, objKey);

						if (ref.isReference) {
							queryString += ref.str();
						}
						else {
							const key = `between_${column}${i}`;

							queryString += ':' + key;
							queryParams[key] = val;
						}
	
						queryString += ' AND ';
					}

					queryString = queryString.replace(/ AND +$/, '');
					queryString += ') AND ';

				}
			}
		}
		else if (queryType === 'lessThan') {
			for (const column in query.lessThan) {
				const val = query.lessThan[column];
				const ref = new QueryColumnReference(val, objKey);

				if (ref.isReference) {
					queryString += `${objKey}.${column} < ${ref.str()} AND `;
				}
				else {
					const key = 'lt_' + column;

					// Append key to queryString
					queryString += `${objKey}.${column} < :${key} AND `;
					queryParams[key] = `${val}`;
				}
			}
		}
		else if (queryType === 'greaterThan') {
			for (const column in query.greaterThan) {
				const val = query.greaterThan[column];
				const ref = new QueryColumnReference(val, objKey);

				if (ref.isReference) {
					queryString += `${objKey}.${column} > ${ref.str()} AND `;
				}
				else {
					const key = 'gt_' + column;
	
					queryString += `${objKey}.${column} > :${key} AND `;
					queryParams[key] = `${val}`;
				}
			}
		}
		else if (queryType === 'lessThanOrEqual') {
			for (const column in query.lessThanOrEqual) {
				const val = query.lessThanOrEqual[column];
				const ref = new QueryColumnReference(val, objKey);

				if (ref.isReference) {
					queryString +=
						`${objKey}.${column} <= ${ref.str()} AND `;
				}
				else {
					const key = 'lte_' + column;
	
					queryString +=
						`${objKey}.${column} <= ` +
						`:${key} AND `;
	
					queryParams[key] = `${val}`;
				}
			}
		}
		else if (queryType === 'greaterThanOrEqual') {
			for (const column in query.greaterThanOrEqual) {
				const val = query.greaterThanOrEqual[column];
				const ref = new QueryColumnReference(val, objKey);

				if (ref.isReference) {
					queryString += 
					`${objKey}.${column} >= ` +
					`${ref.str()} AND `;
				}
				else {
					const key = 'gte_' + column;

					queryString +=
						`${objKey}.${column} >= ` +
						`:${key} AND `;

					queryParams[key] = `${val}`;
				}
			}
		}
		else if (queryType === 'not') {
			for (const column in query.not) {
				const val = query.not[column];
				const ref = new QueryColumnReference(val, objKey);

				if (ref.isReference) {
					queryString += `${objKey}.${column}!=${ref.str()} AND `;
				}
				else {
					const key = 'not_' + column;

					queryString += `${objKey}.${column}!=:${key} AND `;
					queryParams[key] = `${val}`;
				}
			}
		}
	}

	queryString = queryString.replace(/ AND +$/, '');

	return { queryString, queryParams };
}
