import { isSelf } from '../../../../src/utils';
import { BaseUser } from '../../../../src/models';

/**
 * isSelf()
 * pointyapi/utils
 */
describe('[Utils] isSelf', () => {
	it('returns true if the user matches the result', () => {
		// Create user
		const user = new BaseUser();
		user.id = 2;

		// Check if self
		const result = isSelf(user, user, BaseUser, BaseUser);

		// Expect result to be true
		expect(result).toBe(true);
	});

	it('returns false if the user does not match the result', () => {
		// Create user
		const user = new BaseUser();
		user.id = 2;

		// Check if self
		const result = isSelf(user, new BaseUser(), BaseUser, BaseUser);

		// Expect result to be false
		expect(result).toBe(false);
	});
});
