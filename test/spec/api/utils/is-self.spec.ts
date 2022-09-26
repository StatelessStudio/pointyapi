import 'jasmine';
import { isSelf } from '../../../../src/utils';
import { ExampleUser } from '../../../../src/models';

/**
 * isSelf()
 * pointyapi/utils
 */
describe('[Utils] isSelf', () => {
	it('returns true if the user matches the result', () => {
		// Create user
		const user = new ExampleUser();
		user.id = 2;

		// Check if self
		const result = isSelf(user, user, ExampleUser, ExampleUser);

		// Expect result to be true
		expect(result).toBe(true);
	});

	it('returns false if the user does not match the result', () => {
		// Create user
		const user = new ExampleUser();
		user.id = 2;

		// Check if self
		const result = isSelf(
			user,
			new ExampleUser(),
			ExampleUser,
			ExampleUser
		);

		// Expect result to be false
		expect(result).toBe(false);
	});

	it('returns true if the user matches all results in array', () => {
		// Create user
		const user = new ExampleUser();
		user.id = 2;

		// Check if self
		const result = isSelf([ user ], user, ExampleUser, ExampleUser);

		// Expect result to be true
		expect(result).toBe(true);
	});

	it('returns false if the user does not match all results in array', () => {
		// Create user
		const user = new ExampleUser();
		user.id = 2;

		// Check if self
		const result = isSelf(
			[ user ],
			new ExampleUser(),
			ExampleUser,
			ExampleUser
		);

		// Expect result to be false
		expect(result).toBe(false);
	});
});
