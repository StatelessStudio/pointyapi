import { getRepository } from 'typeorm';
import { BaseUserInterface } from '../models';
import { UserRole } from '../enums/user-role';

/**
 * Upgrade a user role for setting up dev users or creating test admins
 * @param username Username to upgrade
 * @param userConstructor User model to use
 * @param role User role to assign to the user
 * @return Return s a Promise
 */
export async function upgradeUserRole(
	username: string,
	userConstructor: BaseUserInterface,
	role: UserRole = UserRole.Admin
): Promise<any> {
	// Get user
	const user = await getRepository(userConstructor)
		.find({
			username: username
		})
		.catch((error) => {
			throw new Error('Could not upgrade user: ' + JSON.stringify(error));
		});

	// Check result
	if (user && user.length) {
		// Upgrade
		user[0]['role'] = role;

		// Save
		await getRepository(userConstructor)
			.save(user)
			.catch((error) => {
				throw new Error('Could not upgrade user: ' + JSON.stringify(error));
			});

		return user;
	}
	else {
		// Could not find user
		throw new Error(`Could not find user ${username} during upgrade`);
	}
}
