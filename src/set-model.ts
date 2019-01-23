/**
 * # Set Model
 *
 * Set model sets the entity the request should use.  You can also
 * set the route parameter (e.g. ':id').  This function should
 * be called in a middleware function BEFORE your endpoints.
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
import { runHook } from './run-hook';

/**
 * Check if the key is in the model, and not a PointyAPI special
 * 	key (`__keyname`)
 * @param key string Key name
 * @param model any Model to check
 * @param response Express::Response (Optional) Response object to
 * 	respond with a 400
 */
function isKeyInModel(key: string, model: any, response?: Response): boolean {
	if (!(key in model) && key.indexOf('__') !== 0) {
		if (response) {
			response.validationResponder(
				'Member key "' + key + '" does not exist in model.'
			);
		}

		return false;
	}
	else {
		return true;
	}
}

/**
 * Set model type and load payload
 * @param request Express::Request Request object
 * @param response Express::Response Response object
 * @param model BaseModelInterface Model to set the request type to
 * @param identifier string (Optional) URL parameter name, for
 * 	example `/users/:id`.  Default is `id`.  Although this parameter
 * 	is optional, you **must** set it to the same string as in your routes.
 */
export async function setModel(
	request: Request,
	response: Response,
	model: BaseModelInterface,
	identifier: string = 'id'
): Promise<any> {
	request.identifier = identifier;
	request.payloadType = model;
	request.payload = new model();
	request.repository = getRepository(request.payloadType);

	if (request.method === 'POST') {
		if (request.body instanceof Array) {
			for (let i = 0; i < request.body.length; i++) {
				request.body[i] = Object.assign(
					new request.payloadType(),
					request.body[i]
				);

				for (const key in request.body[i]) {
					if (request.body[i][key] === undefined) {
						delete request.body[i][key];
					}

					if (!isKeyInModel(key, request.payload, response)) {
						return false;
					}
				}

				// Run model hook
				if (
					!await runHook(
						'beforePost',
						request.body[i],
						request,
						response
					)
				) {
					return false;
				}
			}
		}
		else {
			request.body = Object.assign(
				new request.payloadType(),
				request.body
			);

			for (const key in request.body) {
				if (request.body[key] === undefined) {
					delete request.body[key];
				}

				if (!isKeyInModel(key, request.payload, response)) {
					return false;
				}
			}

			// Run model hook
			if (!await runHook('beforePost', request.body, request, response)) {
				return false;
			}
		}
	}
	else if (request.method === 'GET') {
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
		if (!await runHook('beforeGet', request.query, request, response)) {
			return false;
		}

		let getSuccess = true;

		await getQuery(request, response)
			.then((result) => {
				request.payload = result;
			})
			.catch((error) => {
				if (!response.headersSent) {
					response.error(error);
				}

				getSuccess = false;
			});

		if (!getSuccess) {
			return false;
		}
	}
	else if (request.method === 'PUT') {
		for (const key in request.body) {
			if (!isKeyInModel(key, request.payload, response)) {
				return false;
			}
		}

		// Run model hook
		if (!await runHook('beforePut', request.payload, request, response)) {
			return false;
		}

		if (!await loadEntity(request, response)) {
			return false;
		}
	}
	else if (request.method === 'DELETE') {
		// Run model hook
		if (
			!await runHook('beforeDelete', request.payload, request, response)
		) {
			return false;
		}

		if (!await loadEntity(request, response)) {
			return false;
		}
	}

	return !response.headersSent;
}
