import { ExampleUser } from '../../../../src/models';
import { getBodyguardKeys, compareIdToUser } from '../../../../src/bodyguard';

/**
 * compareIdToUser()
 * pointyapi/bodyguard
 */
describe('[Bodyguard] compareIdToUser', () => {
	beforeAll(() => {
		// Create user
		this.user = new ExampleUser();
		this.user.id = 2;

		// Get bodyguard keys
		this.guardKeys = getBodyguardKeys(new ExampleUser());
	});

	it('returns true if the user matches', () => {
		// Check if this.user has an id of 2
		const result = compareIdToUser('id', 2, this.user, this.guardKeys);

		expect(result).toBe(true);
	});

	it('returns false if the user does not match', () => {
		// This user should not have an id of 3
		const result = compareIdToUser('id', 3, this.user, this.guardKeys);

		expect(result).toBe(false);
	});
});
