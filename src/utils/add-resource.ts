import { BaseModelInterface } from '../models/base-model';
import { getRepository } from 'typeorm';

/**
 * Add a resource to the database. This is useful for filling out database with
 * 	admin/developer resources
 * @param type Model type the resource should belong to
 * @param resource Parameters to create the resource by
 * @return Returns a Promise
 */
export function addResource(type: BaseModelInterface, resource: Object) {
	return getRepository(type).save(resource).catch((error) => {
		console.warn('[addResource] ', error.message);
	});
}
