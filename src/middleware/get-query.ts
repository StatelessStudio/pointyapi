import { Request, Response, NextFunction } from 'express';
import { getSearchableFields } from '../bodyguard';
import { runHook } from '../run-hook';

function createQueryString(
	payloadType,
	objKey: string = 'obj',
	paramKey: string = 'name',
	comparator: string = 'like'
) {
	const searchableFields = getSearchableFields(payloadType);
	let query = '';

	searchableFields.forEach((field) => {
		query += `${objKey}.${field} ${comparator} :${paramKey} OR `;
	});

	return query.replace(/ OR +$/, '');
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

	// Delete undefined members
	for (const key in request.query) {
		if (request.query[key] === undefined) {
			delete request.query[key];
		}
	}

	if (
		'query' in request &&
		'search' in request.query &&
		request.query.search.length
	) {
		// Search
		await request.repository
			.createQueryBuilder('obj')
			.where(createQueryString(request.body))
			.setParameters({ name: `%${request.query.search}%` })
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
	else if ('query' in request && Array(request.query).length) {
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
