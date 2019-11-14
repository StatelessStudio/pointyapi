import { ExampleUser } from '../../../../src/models';
import { getBodyguardKeys, compareIdToUser } from '../../../../src/bodyguard';

/**
 * compareIdToUser()
 * pointyapi/bodyguard
 */
describe('[Bodyguard] compareIdToUser', () => {
	let user;
	let guardKeys;

	beforeAll(() => {
		// Create user
		user = new ExampleUser();
		user.id = 2;

		// Get bodyguard keys
		guardKeys = getBodyguardKeys(new ExampleUser());
	});

	it('returns true if the user matches', () => {
		// Check if user has an id of 2
		const result = compareIdToUser('id', 2, user, guardKeys);

		expect(result).toBe(true);
	});

	it('returns false if the user does not match', () => {
		// This user should not have an id of 3
		const result = compareIdToUser('id', 3, user, guardKeys);

		expect(result).toBe(false);
	});
});
