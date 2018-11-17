/**
 * # Models
 *
 * Models are the entities in your application that will be saved for you.
 * Users should extend BaseUser, and any other model can extend BaseModel.
 */

/**
 * Models
 */
export { BaseModel, BaseModelInterface } from './models/base-model';
export { BaseUser, BaseUserInterface } from './models/base-user';

export function getISOTime() {
	return new Date(Date.now()).toISOString();
}
