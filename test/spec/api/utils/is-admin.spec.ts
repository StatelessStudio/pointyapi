import 'jasmine';
import { isAdmin } from '../../../../src/utils';
import { ExampleUser } from '../../../../src/models';
import { UserRole } from '../../../../src/enums';

/**
 * isAdmin()
 * pointyapi/utils
 */
describe('[Utils] isAdmin', () => {
	it('returns true if the user is an admin', () => {
		// Create admin user
		const user = new ExampleUser();
		user.role = UserRole.Admin;

		// Expect isAdmin() to return true
		expect(isAdmin(user)).toBe(true);
	});

	it('returns false if the user is not an admin', () => {
		// Create basic user
		const user = new ExampleUser();

		// Expect isAdmin() to return false
		expect(isAdmin(user)).toBe(false);
	});
});
