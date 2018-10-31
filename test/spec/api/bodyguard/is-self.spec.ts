import { isSelf } from '../../../../src/bodyguard';
import { BaseUser } from '../../../../src/models';

describe('[Bodyguard] isSelf', () => {
	it('returns true if the user matches the result', () => {
		const user = new BaseUser();
		user.id = 2;

		expect(isSelf(user, user)).toBe(true);
	});

	it('returns false if the user does not match the result', () => {
		const user = new BaseUser();
		user.id = 2;

		expect(isSelf(user, new BaseUser())).toBe(false);
	});
});
