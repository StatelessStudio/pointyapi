import { BaseUser } from '../../../../src/models';
import { UserRole } from '../../../../src/enums';
import { upgradeUserRole } from '../../../../src/utils/upgrade-user-role';
import { getRepository } from 'typeorm';

/**
 * upgradeUserRole()
 * pointyapi/utils
 */
describe('upgradeUserRole()', () => {
	beforeAll(async () => {
		// Create user
		this.user = new BaseUser();
		this.user.fname = 'BaseUser';
		this.user.lname = 'Upgrade';
		this.user.username = 'baseUserUpgrade';
		this.user.password = 'password123';
		this.user.email = 'baseUserUpgrade@test.com';
		this.user.role = UserRole.Basic;

		// Save user
		this.user = await getRepository(BaseUser)
			.save(this.user)
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can upgrade user', async () => {
		// Upgrade role to admin
		await upgradeUserRole(
			'baseUserUpgrade',
			BaseUser,
			UserRole.Admin
		).catch((error) =>
			fail('Could not upgrade user role: ' + JSON.stringify(error))
		);

		// Pull user back from database
		this.user = await getRepository(BaseUser)
			.findOne(this.user.id)
			.catch((error) => fail(JSON.stringify(error)));

		// Check value
		expect(this.user.role).toEqual(UserRole.Admin);
	});

	it('rejects if the user is not found', async () => {
		let result = false;

		// Upgrade role to admin
		await upgradeUserRole('nobody', BaseUser, UserRole.Admin)
			.then((error) =>
				fail('Upgraded nobodies user role: ' + JSON.stringify(error))
			)
			.catch(() => (result = true));

		// Check value
		expect(result).toBe(true);
	});
});
