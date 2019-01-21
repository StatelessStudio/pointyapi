/**
 * # Endpoints
 *
 * Endpoints are where the action of a route actually takes place,
 * for example posting an object or logging in.  The following
 * endpoints come premade:
 * - CRUD
 *  - postEndpoint
 *  - getEndpoint
 *  - putEndpoint
 *  - deleteEndpoint
 * - Auth
 *  - loginEndpoint
 *  - logoutEndpoint (TODO)
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
 * router.use((request, response, next) => {
 * 		if (await setModel(request, BaseUser, 'id')) {
 * 			next();
 * 		}
 * });
 *
 * // Set routes
 * router.post('/', postGuard, postEndpoint);
 * router.get('/', getGuard, getEndpoint);
 * router.put(`/:id`, onlySelf, putGuard, putEndpoint);
 * router.delete(`/:id`, onlySelf, deleteGuard, deleteEndpoint);
 *
 * // Export router
 * export const userRouter: Router = router;
 * ```
 */

/**
 * Endpoints
 */
export { deleteEndpoint } from './endpoints/delete';
export { getEndpoint } from './endpoints/get';
export { postEndpoint } from './endpoints/post';
export { putEndpoint } from './endpoints/put';
export { loginEndpoint } from './endpoints/login';
export { logoutEndpoint } from './endpoints/logout';
