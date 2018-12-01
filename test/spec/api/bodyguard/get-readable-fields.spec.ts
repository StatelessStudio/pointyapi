import { BaseUser } from '../../../../src/models';
import { getReadableFields } from '../../../../src/bodyguard';

describe('[Bodyguard] getReadableFields', () => {
	it('returns an array of one key for BaseUser', () => {
		const user = new BaseUser();
		user.id = 1;

		const readableFields = getReadableFields(user, user);

		expect(readableFields).toEqual(jasmine.any(Array));
		expect(readableFields.length).toBeGreaterThanOrEqual(1);
		expect(readableFields[0]).toEqual(jasmine.any(String));
	});
});
