import { isAdmin } from '../../../../src/bodyguard';
import { BaseUser } from '../../../../src/models';
import { UserRole } from '../../../../src/enums';

/**
 * isAdmin()
 * pointyapi/bodyguard
 */
describe('[Bodyguard] isAdmin', () => {
	/**
	 * isAdmin() positive
	 */
	it('returns true if the user is an admin', () => {
		// Create admin user
		const user = new BaseUser();
		user.role = UserRole.Admin;

		// Expect isAdmin() to return true
		expect(isAdmin(user)).toBe(true);
	});

	/**
	 * isAdmin() negative
	 */
	it('returns false if the user is not an admin', () => {
		// Create basic user
		const user = new BaseUser();

		// Expect isAdmin() to return false
		expect(isAdmin(user)).toBe(false);
	});
});
