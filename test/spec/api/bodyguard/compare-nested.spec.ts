import { BaseModel, BaseUser } from '../../../../src/models';
import {
	getBodyguardKeys,
	compareNestedBodyguards,
	BodyguardKey
} from '../../../../src/bodyguard';

class TestModel extends BaseModel {
	@BodyguardKey() public owner: BaseUser = undefined;
}

describe('[Bodyguard] compareNested()', () => {
	it('returns true if the object matches', () => {
		const user = new BaseUser();
		user.id = 2;

		const test = new TestModel();
		test.owner = user;

		const objBodyguardKeys = getBodyguardKeys(test);
		const userBodyguardKeys = getBodyguardKeys(user);

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
		const user = new BaseUser();
		user.id = 2;

		const user2 = new BaseUser();
		user.id = 3;

		const test = new TestModel();
		test.owner = user;

		const objBodyguardKeys = getBodyguardKeys(test);
		const userBodyguardKeys = getBodyguardKeys(user);

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
