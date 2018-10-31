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
 *		setModel(request, BaseUser, 'id');
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

export function setModel(
	request: Request,
	response: Response,
	model: BaseModelInterface,
	identifier?: string
) {
	request.identifier = identifier;
	request.payloadType = model;
	request.payload = new model();
	request.repository = getRepository(request.payloadType);

	if (request.params && request.params instanceof Object) {
		request.params = Object.assign(request.payload, request.params);
	}

	if (request.query && request.query instanceof Object) {
		request.query = Object.assign(request.payload, request.query);
	}

	if (request.body && request.body instanceof Object) {
		request.body = Object.assign(request.payload, request.body);
	}
}
