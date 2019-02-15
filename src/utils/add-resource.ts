import { BaseModelInterface } from 'models/base-model';
import { getRepository } from 'typeorm';

export async function addResource(type: BaseModelInterface, resource: Object) {
	return await getRepository(type).save(resource).catch((error) => {
		console.warn('[addResource] ', error.message);
	});
}
