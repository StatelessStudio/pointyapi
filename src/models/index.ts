/**
 * # Models
 *
 * Models are the entities in your application that will be saved for you.
 * Users should extend BaseUser, and any other model can extend BaseModel.
 *
 * Take a look at the models in `examples/`.
 *
 * ## Model Hooks
 * Hooks are model methods which run at specific times during a request.
 * Built-in hooks are:
 * - login
 * 	- Runs during `setModel` on an auth POST request
 * 	- `this` is bound to the `request.body` (user's credentials)
 * - logout
 * 	- Runs during `setModel` on an auth DELETE request
 * 	- `this` is bound to the `request.user` (current user)
 * - beforePost
 * 	- Runs during `setModel` on a POST request
 * 	- `this` is bound to each object of the `request.body` (post objects)
 * - beforePatch
 * 	- Runs during `setModel` on a PATCH request
 * 	- `this` is bound to each object of the `request.body` (patch object)
 * - beforeDelete
 * 	- Runs during `setModel` on a DELETE request
 * 	- `this` is bound to each object to be deleted
 * - get
 * 	- Runs during `getEndpoint`
 * 	- `this` is bound to each object found
 * - post
 * 	- Runs during `postEndpoint`
 * 	- `this` is bound to each object of the `request.body` (post objects)
 * - patch
 * 	- Runs during `patchEndpoint`
 * 	- `this` is bound to the `request.body` (patch object)
 * - delete
 * 	- Runs during `deleteEndpoint`
 * 	- `this` is bound to the object to be deleted
 */

/**
 * Models
 */
export { BaseModel, BaseModelInterface } from './base-model';
export { BaseUser, BaseUserInterface } from './base-user';
export { ExampleUser } from './example-user';

export function getISOTime() {
	return new Date(Date.now()).toISOString();
}
