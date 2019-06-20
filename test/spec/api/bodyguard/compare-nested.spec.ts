import { BaseModel, ExampleUser } from '../../../../src/models';
import {
	getBodyguardKeys,
	compareNestedBodyguards,
	BodyguardKey
} from '../../../../src/bodyguard';

class TestModel extends BaseModel {
	@BodyguardKey() public owner: ExampleUser = undefined;
}

/**
 * compareNested()
 * pointyapi/bodyguard
 */
describe('[Bodyguard] compareNested()', () => {
	it('returns true if the object matches', () => {
		// Create base user
		const user = new ExampleUser();
		user.id = 2;

		// Create comparator user
		const test = new TestModel();
		test.owner = user;

		// Get bodyguard keys
		const objBodyguardKeys = getBodyguardKeys(test);
		const userBodyguardKeys = getBodyguardKeys(user);

		// Check compareNested()
		expect(
			compareNestedBodyguards(
				test,
				user,
				objBodyguardKeys,
				userBodyguardKeys
			)
		).toBe(true);
	});

	it('returns false if the object does not match', () => {
		// Create base user
		const user = new ExampleUser();
		user.id = 2;

		// Create another base user
		const user2 = new ExampleUser();
		user.id = 3;

		// Create a resource belonging to user
		const test = new TestModel();
		test.owner = user;

		// Get bodyguard keys
		const objBodyguardKeys = getBodyguardKeys(test);
		const userBodyguardKeys = getBodyguardKeys(user);

		// User 1 should own the test resource
		expect(
			compareNestedBodyguards(
				test,
				user2,
				objBodyguardKeys,
				userBodyguardKeys
			)
		).toBe(false);
	});
});
