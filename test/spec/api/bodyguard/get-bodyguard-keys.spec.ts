import { BaseUser } from '../../../../src/models';
import { getBodyguardKeys } from '../../../../src/bodyguard';

describe('[Bodyguard] getBodyguardKeys', () => {
	it('returns an array of one key for BaseUser', () => {
		const ownerKeys = getBodyguardKeys(new BaseUser());

		expect(ownerKeys).toEqual(jasmine.any(Array));
		expect(ownerKeys.length).toBeGreaterThanOrEqual(1);
		expect(ownerKeys[0]).toEqual(jasmine.any(String));
	});
});
