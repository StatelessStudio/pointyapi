import { getRepository } from 'typeorm';
import { BaseUserInterface } from '../models';
import { UserRole } from '../enums/user-role';

/**
 * Upgrade a user role for setting up dev users or creating test admins
 * @param username string Username to upgrade
 * @param userConstructor BaseUserInterface User model to use
 * @param role UserRole User role to assign to the user
 */
export async function upgradeUserRole(
	username: string,
	userConstructor: BaseUserInterface,
	role: UserRole = UserRole.Admin
): Promise<any> {
	return new Promise(async (accept, reject) => {
		// Get user
		const user = await getRepository(userConstructor)
			.find({
				username: username
			})
			.catch((error) =>
				reject('Could not upgrade user: ' + JSON.stringify(error))
			);

		// Check result
		if (user && user.length) {
			// Upgrade
			user[0]['role'] = role;

			// Save
			await getRepository(userConstructor)
				.save(user)
				.catch((error) =>
					reject('Could not upgrade user: ' + JSON.stringify(error))
				);

			accept(user);
		}
		else {
			// Could not find user
			reject('Could not find user during upgrade');
		}
	});
}
