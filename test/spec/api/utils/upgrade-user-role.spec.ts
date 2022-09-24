import 'jasmine';
import { ExampleUser } from '../../../../src/models';
import { UserRole } from '../../../../src/enums';
import { upgradeUserRole } from '../../../../src/utils/upgrade-user-role';
import { getRepository } from 'typeorm';

/**
 * upgradeUserRole()
 * pointyapi/utils
 */
describe('upgradeUserRole()', () => {
	let user;

	beforeAll(async () => {
		// Create user
		user = new ExampleUser();
		user.fname = 'ExampleUser';
		user.lname = 'Upgrade';
		user.username = 'baseUserUpgrade';
		user.password = 'password123';
		user.email = 'baseUserUpgrade@test.com';
		user.role = UserRole.Basic;

		// Save user
		user = await getRepository(ExampleUser)
			.save(user)
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can upgrade user', async () => {
		// Upgrade role to admin
		await upgradeUserRole(
			'baseUserUpgrade',
			ExampleUser,
			UserRole.Admin
		).catch((error) =>
			fail('Could not upgrade user role: ' + JSON.stringify(error))
		);

		// Pull user back from database
		user = await getRepository(ExampleUser)
			.findOne(user.id)
			.catch((error) => fail(JSON.stringify(error)));

		// Check value
		expect(user.role).toEqual(UserRole.Admin);
	});

	it('rejects if the user is not found', async () => {
		let result = false;

		// Upgrade role to admin
		await upgradeUserRole('nobody', ExampleUser, UserRole.Admin)
			.then((error) =>
				fail('Upgraded nobodies user role: ' + JSON.stringify(error))
			)
			.catch(() => (result = true));

		// Check value
		expect(result).toBe(true);
	});
});
