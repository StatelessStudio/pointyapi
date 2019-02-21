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
import { runHook, isKeyInModel } from './utils';
import { queryValidator } from './utils/query-validator';

/**
 * Set model type and load payload
 * @param request Express::Request Request object
 * @param response Express::Response Response object
 * @param model BaseModelInterface Model to set the request type to
 * @param isAuth boolean (Optional) If this is an authentication route.
 * 	Default is false.
 * 	Will run beforeLogin() and beforeLogout() posts instead of post/delete hook
 * @param identifier string (Optional) URL parameter name, for
 * 	example `/users/:id`.  Default is `id`.  Although this parameter
 * 	is optional, you **must** set it to the same string as in your routes.
 */
export async function setModel(
	request: Request,
	response: Response,
	model: BaseModelInterface,
	isAuth: boolean = false,
	identifier: string = 'id'
): Promise<any> {
	request.identifier = identifier;
	request.payloadType = model;
	request.payload = new model();
	request.repository = getRepository(request.payloadType);

	// Substitute authenticated user as resource for auth router deletes
	if (isAuth && request.method === 'DELETE') {
		request.params = request.user;

		if (request.user) {
			request.params = request.user;
		}
		else {
			response.unauthorizedResponder('Not authenticated');

			return false;
		}
	}

	// Post loader
	if (request.method === 'POST') {
		// Load post array
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
			}
		}
		else {
			// Load post object
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
		}

		// Run model hook
		if (
			!await runHook(
				isAuth ? 'beforeLogin' : 'beforePost',
				request.body,
				request,
				response
			)
		) {
			return false;
		}
	}
	else if (request.method === 'GET') {
		// Get loader
		// TODO: Remove
		// request.query = Object.assign(new request.payloadType(), request.query);

		if (!queryValidator(request, response)) {
			return false;
		}

		let getSuccess = true;

		request.payload = await getQuery(request, response).catch((error) => {
			if (!response.headersSent) {
				response.error(error);
			}

			getSuccess = false;
		});

		if (!getSuccess) {
			return false;
		}
	}
	else if (request.method === 'PATCH') {
		// Patch loader
		for (const key in request.body) {
			if (!isKeyInModel(key, request.payload, response)) {
				return false;
			}
		}

		// Load entity
		if (!await loadEntity(request, response)) {
			return false;
		}

		// Run model hook
		if (!await runHook('beforePatch', request.payload, request, response)) {
			return false;
		}
	}
	else if (request.method === 'DELETE') {
		// Load entity
		if (!await loadEntity(request, response)) {
			return false;
		}

		// Delete loader
		// Run model hook
		if (
			!await runHook(
				isAuth ? 'beforeLogout' : 'beforeDelete',
				request.payload,
				request,
				response
			)
		) {
			return false;
		}
	}

	return !response.headersSent;
}
