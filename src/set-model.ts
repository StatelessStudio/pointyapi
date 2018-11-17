/**
 * # Set Model
 *
 * Set model sets the entity the request should use.  You can also
 * set the route parameter (e.g. ':id').  This function should
 * be called in a middleware function BEFORE your endpoints.
 *
 * ```typescript
 * import { setModel } from 'pointyapi/set-model';
 * import { BaseUser } from 'pointyapi/models';
 *
 * router.use((request, response, next) => {
 *		await setModel(request,BaseUser, 'id');
 * 		next();
 * });
 *
 * // Set your router endpoints AFTER setModel();
 * // TODO: Set endpoints
 *
 * ```
 *
 * ## Parameters
 * - **request** - The Express Request object
 * - **model** - A model to set the request entity to.  This should be a type,
 * not an instance
 * - **identifier** - (Optional) The URL path identifier for the request, e.g.
 * if your path is `/user/:username`, you should set your identifier to
 * `username`
 *
 */

/**
 * Set Model
 */
import { Request, Response } from 'express';
import { BaseModelInterface } from './models';
import { getRepository } from 'typeorm';
import { getQuery, loadEntity } from './middleware';
import { log } from 'util';
import { runHook } from './run-hook';

function isKeyInModel(key, model, response) {
	if (!(key in model) && key.indexOf('__') !== 0) {
		response.validationResponder(
			'Member key "' + key + '" does not exist in model.',
			response
		);
	}
	else {
		return true;
	}
}

export async function setModel(
	request: Request,
	response: Response,
	model: BaseModelInterface,
	identifier: string = 'id'
) {
	request.identifier = identifier;
	request.payloadType = model;
	request.payload = new model();
	request.repository = getRepository(request.payloadType);

	if (request.method === 'POST') {
		request.body = Object.assign(new request.payloadType(), request.body);

		for (const key in request.body) {
			if (request.body[key] === undefined) {
				delete request.body[key];
			}

			if (!isKeyInModel(key, request.payload, response)) {
				return false;
			}
		}

		// Run model hook
		if (!runHook(request, response, 'beforeLoadPost', request.body)) {
			return;
		}
	}
	if (request.method === 'GET') {
		request.query = Object.assign(new request.payloadType(), request.query);

		for (const key in request.query) {
			if (request.query[key] === undefined) {
				delete request.query[key];
			}

			if (!isKeyInModel(key, request.payload, response)) {
				return false;
			}
		}

		// Run model hook
		if (!runHook(request, response, 'beforeLoadGet', request.query)) {
			return;
		}

		await getQuery(request, response);
	}
	else if (request.method === 'PUT') {
		for (const key in request.body) {
			if (!isKeyInModel(key, request.payload, response)) {
				return false;
			}
		}

		// Run model hook
		if (!runHook(request, response, 'beforeLoadPut', request.payload)) {
			return;
		}

		await loadEntity(request, response);
	}
	else if (request.method === 'DELETE') {
		// Run model hook
		if (!runHook(request, response, 'beforeLoadDelete', request.payload)) {
			return;
		}

		await loadEntity(request, response);
	}

	return !response.headersSent;
}
