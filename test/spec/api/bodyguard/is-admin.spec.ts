import { isAdmin } from '../../../../src/bodyguard';
import { BaseUser } from '../../../../src/models';
import { UserRole } from '../../../../src/enums';

describe('[Bodyguard] isAdmin', () => {
	it('returns true if the user is an admin', () => {
		const user = new BaseUser();
		user.role = UserRole.Admin;

		expect(isAdmin(user)).toBe(true);
	});

	it('returns false if the user is not an admin', () => {
		const user = new BaseUser();

		expect(isAdmin(user)).toBe(false);
	});
});
