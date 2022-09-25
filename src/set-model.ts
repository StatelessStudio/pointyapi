/**
 * # Set Model
 *
 * Set model sets the entity the request should use. You can also
 * set the route parameter (e.g. ':id'). This function should
 * be called in a middleware function BEFORE your endpoints.
 *
 * ## Auth Routes
 *
 * Auth routes must specify to `setModel` that it is an auth route. Do
 * this by passing `true` to the `isAuth` (fourth) parameter.
 */

/**
 * Set Model
 */
import { Request, Response } from './index';
import { BaseModelInterface } from './models';
import { getRepository } from 'typeorm';
import { getQuery, loadEntity } from './middleware';
import { runHook, isKeyInModel, deleteUndefinedMembers } from './utils';
import { queryValidator } from './query-tools/query-validator';

/**
 * Set model type and load payload
 * @param request Request object
 * @param response Response object
 * @param model Model to set the request type to
 * @param isAuth If this is an authentication route.
 * 	Default is false.
 * 	Will run beforeLogin() and beforeLogout() posts instead of post/delete hook
 * @param identifier URL parameter name, for
 * 	example `/users/:id`. Default is `id`. Although this parameter
 * 	is optional, you **must** set it to the same string as in your routes.
 * @return Returns a Promise
 */
export async function setModel(
	request: Request,
	response: Response,
	model: BaseModelInterface,
	isAuth = false,
	identifier = 'id'
): Promise<any> {
	request.identifier = identifier;
	request.payloadType = model;
	request.payload = new model();
	request.repository = getRepository(request.payloadType);

	// Substitute authenticated user as resource for auth router deletes
	if (isAuth && request.method === 'DELETE') {
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

		// Set model type
		request.body = Object.assign(new request.payloadType(), request.body);
		request.body = deleteUndefinedMembers(request.body);

		// Run model hook
		if (!await runHook('beforePatch', request.body, request, response)) {
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
