/**
 * # Endpoints
 *
 * Endpoints are where the action of a route actually takes place,
 * for example posting a resource or logging in.  The following
 * endpoints come premade:
 * - CRUD
 *  - postEndpoint
 *  - getEndpoint
 *  - patchEndpoint
 *  - deleteEndpoint
 * - Auth
 *  - loginEndpoint
 *  - logoutEndpoint
 *
 * ## Using endpoints
 *
 * Endpoints go in your route, after any guards.  You'll have to
 * set a model so the guards and endpoints know what you're working with.
 *
 * ```typescript
 * import { setModel } from 'pointyapi/set-model';
 * import { ExampleUser } from 'pointyapi/models';
 *
 * // Guards
 * import { onlySelf } from 'pointyapi/guards';
 *
 * // Filters
 * import { postFilter, getFilter, patchFilter } from 'pointyapi/filters';
 *
 * // Endpoints
 * import {
 * 		postEndpoint,
 * 		getEndpoint,
 * 		patchEndpoint,
 * 		deleteEndpoint
 * } from 'pointyapi/endpoints';
 *
 * // Create router
 * const router: Router = Router();
 *
 * // Set model
 * async function loader(request, response, next) {
 * 		if (await setModel(request, ExampleUser)) {
 * 			next();
 * 		}
 * }
 *
 * // Set routes
 * router.post('/', loader, postFilter, postEndpoint);
 * router.get('/', loader, getFilter, getEndpoint);
 * router.patch(`/:id`, loader, onlySelf, patchFilter, patchEndpoint);
 * router.delete(`/:id`, loader, onlySelf, deleteEndpoint);
 *
 * // Export router
 * export const userRouter: Router = router;
 * ```
 */

/**
 * Endpoints
 */
export { deleteEndpoint } from './endpoints/delete-endpoint';
export { getEndpoint } from './endpoints/get-endpoint';
export { postEndpoint } from './endpoints/post-endpoint';
export { patchEndpoint } from './endpoints/patch-endpoint';
export { loginEndpoint } from './endpoints/login-endpoint';
export { logoutEndpoint } from './endpoints/logout-endpoint';
export { refreshTokenEndpoint } from './endpoints/refresh-token-endpoint';
