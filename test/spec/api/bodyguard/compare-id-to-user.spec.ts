import { BaseUser } from '../../../../src/models';
import { getBodyguardKeys, compareIdToUser } from '../../../../src/bodyguard';

describe('[Bodyguard] compareIdToUser', () => {
	beforeAll(() => {
		this.user = new BaseUser();
		this.user.id = 2;

		this.guardKeys = getBodyguardKeys(new BaseUser());
	});

	it('returns true if the user matches', () => {
		expect(compareIdToUser('id', 2, this.user, this.guardKeys)).toBe(true);
	});

	it('returns false if the user does not match', () => {
		expect(compareIdToUser('id', 3, this.user, this.guardKeys)).toBe(false);
	});
});
