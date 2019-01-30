/**
 * # Endpoints
 *
 * Endpoints are where the action of a route actually takes place,
 * for example posting a resource or logging in.  The following
 * endpoints come premade:
 * - CRUD
 *  - postEndpoint
 *  - getEndpoint
 *  - putEndpoint
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
 * import { BaseUser } from 'pointyapi/models';
 *
 * // Guards
 * import {
 * 		postGuard,
 * 		getGuard,
 * 		putGuard,
 * 		deleteGuard,
 * 		onlySelf
 * } from 'pointyapi/guards';
 *
 * // Endpoints
 * import {
 * 		postEndpoint,
 * 		getEndpoint,
 * 		putEndpoint,
 * 		deleteEndpoint
 * } from 'pointyapi/endpoints';
 *
 * // Create router
 * const router: Router = Router();
 *
 * // Set model
 * async function loader(request, response, next) {
 * 		if (await setModel(request, BaseUser)) {
 * 			next();
 * 		}
 * }
 *
 * // Set routes
 * router.post('/', loader, postGuard, postEndpoint);
 * router.get('/', loader, getGuard, getEndpoint);
 * router.put(`/:id`, loader, onlySelf, putGuard, putEndpoint);
 * router.delete(`/:id`, loader, onlySelf, deleteGuard, deleteEndpoint);
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
export { putEndpoint } from './endpoints/put-endpoint';
export { loginEndpoint } from './endpoints/login-endpoint';
export { logoutEndpoint } from './endpoints/logout-endpoint';
