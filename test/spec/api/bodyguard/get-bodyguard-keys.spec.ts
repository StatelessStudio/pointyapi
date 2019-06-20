import { ExampleUser } from '../../../../src/models';
import { getBodyguardKeys } from '../../../../src/bodyguard';

/**
 * getBodyguardKeys()
 * pointyapi/bodyguard
 */
describe('[Bodyguard] getBodyguardKeys', () => {
	it('returns an array of one key for ExampleUser', () => {
		// Get bodyguard keys
		const ownerKeys = getBodyguardKeys(new ExampleUser());

		// Expect keys to be an array of strings
		expect(ownerKeys).toEqual(jasmine.any(Array));
		expect(ownerKeys.length).toBeGreaterThanOrEqual(1);
		expect(ownerKeys[0]).toEqual(jasmine.any(String));
	});
});
