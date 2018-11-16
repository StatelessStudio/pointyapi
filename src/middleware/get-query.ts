import { Request, Response, NextFunction } from 'express';
import {
	getSearchableFields,
	getReadableFields,
	getBodyguardKeys
} from '../bodyguard';
import { runHook } from '../run-hook';

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
				field !== '__search' &&
				!(obj[field] instanceof Function)
			) {
				// Append key to queryString
				queryString += `${objKey}.${field}=:${field} AND `;

				// Append parameter to queryParams
				queryParams[field] = `${obj[field]}`;
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

	if (
		'query' in request &&
		'__search' in request.query &&
		request.query.__search.length
	) {
		const objMnemonic = 'obj';
		let join = [];

		// Search
		const { queryString, queryParams } = createSearchQuery(
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
			join = getBodyguardKeys(new request.payloadType());
		}

		// Create selection
		let selection = await request.repository
			.createQueryBuilder(objMnemonic)
			.select(readableFields);

		// Loop through join tables
		for (const table of join) {
			selection = await selection.leftJoinAndSelect(
				`${objMnemonic}.${table}`,
				table
			);
		}

		// Complete selection
		await selection
			.where(queryString)
			.setParameters(queryParams)
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
