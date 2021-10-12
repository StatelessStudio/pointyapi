import { Request, Response } from 'express';
import { getReadableFields, getBodyguardKeys } from '../bodyguard';

import { createSearchQuery } from '../utils';
import { Query } from './query';

/**
 * Get the objects represented by the request query
 * @param request Request to query by
 * @param response Response object to respond with
 * @return Returns a Promise of an array or single object
 */
export async function getQuery(
	request: Request,
	response: Response
): Promise<any> {
	const requestQueryParams: Query = request.query;

	if ('id' in requestQueryParams && requestQueryParams.id) {
		// Read one
		return request.repository.findOne(requestQueryParams.id);
	}
	else if (Object.keys(requestQueryParams).length) {
		// Read query

		const shouldCount = 'count' in requestQueryParams && requestQueryParams.count;

		// Readable keys
		let readableFields = getReadableFields(
			new request.payloadType(),
			request.user,
			'obj'
		);

		// Extract select query keys
		const selectKeys = [];
		if ('select' in requestQueryParams) {
			for (let key of requestQueryParams.select) {
				key = `obj.${key}`;
				selectKeys.push(key);
			}

			readableFields = selectKeys;
		}

		// Extract Join join query keys
		if ('join' in requestQueryParams) {
			requestQueryParams.join.forEach((key) => {
				if (!request.joinMembers.includes(key)) {
					request.joinMembers.push(key);
				}
			});
		}

		// Extract Group By query keys
		const groupByKeys = [];
		if ('groupBy' in requestQueryParams) {
			requestQueryParams.groupBy.forEach((key) => {
				groupByKeys.push(key);
			});

			// Add 'id' to array if not already
			if (
				readableFields.includes('obj.id') &&
				!('id' in requestQueryParams.groupBy)
			) {
				groupByKeys.push('id');
			}
		}

		// Extract order By query keys
		const orderByKeys = [];
		const orderByOrders = [];
		if ('orderBy' in requestQueryParams) {
			for (const key in requestQueryParams.orderBy) {
				orderByKeys.push(key);
				orderByOrders.push(
					requestQueryParams.orderBy[key].toUpperCase() === 'DESC' ?
						'DESC' :
						'ASC'
				);
			}
		}

		// Search
		// tslint:disable-next-line:prefer-const
		let { queryString, queryParams } = createSearchQuery(
			request.payloadType,
			requestQueryParams
		);

		// Join bodyguard keys, unless this is the User
		if (request.payloadType !== request.userType) {
			// Append to join array
			const bodyguardKeys = getBodyguardKeys(new request.payloadType());

			bodyguardKeys.forEach((key) => {
				if (!request.joinMembers.includes(key)) {
					request.joinMembers.push(key);
				}
			});

			// Append to where clause
			// TODO: [Issue #146] The following code creates a bug, where if a user is authenticated
			// 	and not admin, they will be unable to view the resource, including AnyoneCanRead()
			// 	keys.
			// 	Although the initial purpose for the exact code is scarcely documented, it is believed
			// 	to be used to prevent the database from pulling enourmous payloads that will be filtered
			// 	extensively (to dramatically reduce runtime of the guards and filters).
			/*
			if (
				bodyguardKeys &&
				request.user &&
				request.user.role !== UserRole.Admin
			) {
				if (queryString.length) {
					queryString += ' AND ';
				}

				queryString += '(';
				bodyguardKeys.forEach(key => {
					queryString += `obj.${key}=:bodyGuard${key} OR `;

					queryParams['bodyGuard' + key] = request.user.id;
				});

				queryString = queryString.replace(/ OR +$/, '');
				queryString += `)`;
			}
			*/
		}

		// Create selection
		let selection = await request.repository
			.createQueryBuilder('obj')
			.select(readableFields);

		// Loop through join tables
		for (const table of request.joinMembers) {
			selection = await selection.leftJoinAndSelect(
				`obj.${table}`,
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
			if ('limit' in requestQueryParams && requestQueryParams.limit) {
				query.take(requestQueryParams.limit);
			}

			// Add offset
			if ('offset' in requestQueryParams && requestQueryParams.offset) {
				query.skip(requestQueryParams.offset);
			}
		}

		if ('raw' in requestQueryParams && requestQueryParams.raw) {
			return query.getRawMany();
		}
		else if (groupByKeys.length) {
			const prestring = `obj_`;

			return query.getRawMany().then((result) => {
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
			return query.getMany();
		}
	}
	else {
		// Read all
		return request.repository.find();
	}
}
