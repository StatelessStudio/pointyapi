import { BaseUser } from '../../../../src/models';
import { getReadableFields } from '../../../../src/bodyguard';

/**
 * getReadableFields()
 * pointyapi/bodyguard
 */
describe('[Bodyguard] getReadableFields', () => {
	/**
	 * getReadableFields() returns array of keys
	 */
	it('returns an array of one key for BaseUser', () => {
		// Create user
		const user = new BaseUser();
		user.id = 1;

		// Get readable fields
		const readableFields = getReadableFields(user, user);

		// Expect result to be array of strings
		expect(readableFields).toEqual(jasmine.any(Array));
		expect(readableFields.length).toBeGreaterThanOrEqual(1);
		expect(readableFields[0]).toEqual(jasmine.any(String));
	});
});
