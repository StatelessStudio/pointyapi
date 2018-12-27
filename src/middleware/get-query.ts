import { Request, Response, NextFunction } from 'express';
import {
	getSearchableFields,
	getReadableFields,
	getBodyguardKeys
} from '../bodyguard';
import { runHook } from '../run-hook';
import { UserRole } from '../enums/user-role';

function createSearchQuery(payloadType, obj: Object, objKey: string = 'obj') {
	const searchableFields = getSearchableFields(payloadType);
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

/**
 * Get the objects represented by the request query
 * @param request Request to query by
 * @param response Response object to respond with
 */
export async function getQuery(
	request: Request,
	response: Response,
	next?: NextFunction
) {
	// Run model hook
	if (!runHook(request, response, 'onGetQuery', request.query)) {
		return;
	}

	if ('query' in request && '__search' in request.query) {
		const objMnemonic = 'obj';

		// Extract Join __join query keys
		if ('__join' in request.query) {
			request.query.__join.forEach((key) => {
				request.joinMembers.push(key);
			});

			delete request.query.__join;
		}

		// Extract Group By query keys
		const groupByKeys = [];
		if ('__groupBy' in request.query) {
			request.query.__groupBy.forEach((key) => {
				groupByKeys.push(key);
			});

			// Add 'id' to array if not already
			if (!('id' in request.query.__groupBy)) {
				groupByKeys.push('id');
			}

			delete request.query.__groupBy;
		}

		// Extract order By query keys
		const orderByKeys = [];
		const orderByOrders = [];
		if ('__orderBy' in request.query) {
			for (const key in request.query.__orderBy) {
				orderByKeys.push(objMnemonic + '.' + key);
				orderByOrders.push(
					request.query.__orderBy[key] === 'DESC' ? 'DESC' : 'ASC'
				);
			}

			delete request.query.__orderBy;
		}

		// Extract limit
		let limit;
		if ('__limit' in request.query) {
			limit = request.query.__limit;

			delete request.query.__limit;
		}

		// Extract offset
		let offset;
		if ('__offset' in request.query) {
			offset = request.query.__offset;

			delete request.query.__offset;
		}

		// Extract count
		let shouldCount = false;
		if ('__count' in request.query && request.query.__count) {
			shouldCount = true;

			delete request.query.__count;
		}

		// Search
		// tslint:disable-next-line:prefer-const
		let { queryString, queryParams } = createSearchQuery(
			new request.payloadType(),
			request.query
		);

		// Readable keys
		const readableFields = getReadableFields(
			new request.payloadType(),
			request.user,
			objMnemonic
		);

		// Join bodyguard keys, unless this is the User
		if (request.payloadType !== request.userType) {
			// Append to join array
			const bodyguardKeys = getBodyguardKeys(new request.payloadType());

			bodyguardKeys.forEach((key) => {
				request.joinMembers.push(key);
			});

			// Append to where clause
			if (bodyguardKeys && request.user.role !== UserRole.Admin) {
				queryString += ` AND (`;
				bodyguardKeys.forEach((key) => {
					queryString += `obj.${key}=:bodyGuard${key} OR `;

					queryParams['bodyGuard' + key] = request.user.id;
				});

				queryString = queryString.replace(/ OR +$/, '');
				queryString += `)`;
			}
		}

		// Create selection
		let selection = await request.repository
			.createQueryBuilder(objMnemonic)
			.select(readableFields);

		// Loop through join tables
		for (const table of request.joinMembers) {
			selection = await selection.leftJoinAndSelect(
				`${objMnemonic}.${table}`,
				table
			);
		}

		// Complete selection
		const query = selection.where(queryString).setParameters(queryParams);

		if (!shouldCount) {
			// Add group by keys
			for (const key of groupByKeys) {
				query.addGroupBy(key);
			}

			// Add order by keys
			for (let i = 0; i < orderByKeys.length; i++) {
				query.addOrderBy(orderByKeys[i], orderByOrders[i]);
			}

			// Add limit
			if (limit) {
				query.take(limit);
			}

			// Add offset
			if (offset) {
				query.skip(offset);
			}
		}

		if (shouldCount) {
			request.query.__count = true;
		}

		await query
			.getMany()
			.then((result) => {
				request.payload = result;
				if (next) {
					next();
				}
			})
			.catch((error) => response.error(error, response));
	}
	else if ('query' in request && 'id' in request.query && request.query.id) {
		// Read one
		await request.repository
			.findOne(request.query.id)
			.then((result) => {
				request.payload = result;
				if (next) {
					next();
				}
			})
			.catch((error) => response.error(error, response));
	}
	else if ('query' in request && Object.keys(request.query).length) {
		// Read many
		await request.repository
			.find(request.query)
			.then((result) => {
				request.payload = result;
				if (next) {
					next();
				}
			})
			.catch((error) => response.error(error, response));
	}
	else {
		// Read all
		await request.repository
			.find()
			.then((result) => {
				request.payload = result;
				if (next) {
					next();
				}
			})
			.catch((error) => response.error(error, response));
	}
}
