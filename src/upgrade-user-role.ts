import { getRepository } from 'typeorm';
import { BaseUserInterface } from './models';
import { UserRole } from './enums/user-role';

export async function upgradeUserRole(
	username: string,
	userConstructor: BaseUserInterface,
	role: UserRole = UserRole.Admin
) {
	return new Promise(async (accept, reject) => {
		const admin = await getRepository(userConstructor)
			.find({
				username: username
			})
			.catch((error) =>
				reject('Could not upgrade admin: ' + JSON.stringify(error))
			);

		if (admin && admin.length) {
			admin[0]['role'] = role;

			await getRepository(userConstructor)
				.save(admin)
				.catch((error) =>
					reject('Could not upgrade admin: ' + JSON.stringify(error))
				);

			accept(admin);
		}
		else {
			reject('Could not find admin during upgrade');
		}
	});
}
