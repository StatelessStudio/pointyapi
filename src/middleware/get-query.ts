import { Request, Response } from 'express';
import { getReadableFields, getBodyguardKeys } from '../bodyguard';
import { UserRole } from '../enums/user-role';

import { createSearchQuery } from '../utils';

/**
 * Get the objects represented by the request query
 * @param request Request to query by
 * @param response Response object to respond with
 */
export async function getQuery(
	request: Request,
	response: Response
): Promise<any> {
	if ('query' in request && '__search' in request.query) {
		const objAlias = 'obj';

		// Readable keys
		let readableFields = getReadableFields(
			new request.payloadType(),
			request.user,
			objAlias
		);

		// Extract __select query keys
		const selectKeys = [];
		if ('__select' in request.query) {
			for (let key of request.query.__select) {
				key = `obj.${key}`;

				if (readableFields.includes(key)) {
					selectKeys.push(key);
				}
				else {
					// Key is not readable
					response.forbiddenResponder(`Cannot select by key ${key}`);
					return new Promise((_, reject) => {
						reject(`Cannot select by key ${key}`);
					});
				}
			}

			readableFields = selectKeys;
			delete request.query.__select;
		}

		// Get raw
		let getRaw = false;
		if ('__raw' in request.query && request.query.__raw) {
			getRaw = true;
			delete request.query.__raw;
		}

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
			if (
				readableFields.includes('obj.id') &&
				!('id' in request.query.__groupBy)
			) {
				groupByKeys.push('id');
			}

			delete request.query.__groupBy;
		}

		// Extract order By query keys
		const orderByKeys = [];
		const orderByOrders = [];
		if ('__orderBy' in request.query) {
			for (const key in request.query.__orderBy) {
				orderByKeys.push(key);
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

		// Join bodyguard keys, unless this is the User
		if (request.payloadType !== request.userType) {
			// Append to join array
			const bodyguardKeys = getBodyguardKeys(new request.payloadType());

			bodyguardKeys.forEach((key) => {
				request.joinMembers.push(key);
			});

			// Append to where clause
			if (
				bodyguardKeys &&
				request.user &&
				request.user.role !== UserRole.Admin
			) {
				queryString += ` AND (`;
				bodyguardKeys.forEach((key) => {
					queryString += `${objAlias}.${key}=:bodyGuard${key} OR `;

					queryParams['bodyGuard' + key] = request.user.id;
				});

				queryString = queryString.replace(/ OR +$/, '');
				queryString += `)`;
			}
		}

		// Create selection
		let selection = await request.repository
			.createQueryBuilder(objAlias)
			.select(readableFields);

		// Loop through join tables
		for (const table of request.joinMembers) {
			selection = await selection.leftJoinAndSelect(
				`${objAlias}.${table}`,
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
				let key = orderByKeys[i];

				// Object alias must be prepended if join tables exist,
				// but this field isn't from a join
				if (!key.includes('.')) {
					key = 'obj.' + key;
				}

				query.addOrderBy(key, orderByOrders[i]);
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

		if (getRaw) {
			return await query.getRawMany();
		}
		else if (groupByKeys.length) {
			const prestring = `${objAlias}_`;

			return await query.getRawMany().then((result) => {
				if (result instanceof Array && result.length) {
					result = result.map((resource) => {
						const obj = new request.payloadType();

						for (const key in resource) {
							obj[key.replace(prestring, '')] = resource[key];
						}

						return obj;
					});
				}

				return result;
			});
		}
		else {
			return await query.getMany();
		}
	}
	else if ('query' in request && 'id' in request.query && request.query.id) {
		// Read one
		return await request.repository.findOne(request.query.id);
	}
	else if ('query' in request && Object.keys(request.query).length) {
		// Read many
		return await request.repository.find(request.query);
	}
	else {
		// Read all
		return await request.repository.find();
	}
}
