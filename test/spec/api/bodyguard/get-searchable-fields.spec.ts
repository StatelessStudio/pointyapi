import { BaseUser } from '../../../../src/models';
import { getSearchableFields } from '../../../../src/bodyguard';

/**
 * getSearchableFields()
 * pointyapi/bodyguard
 */
describe('[Bodyguard] getSearchableFields', () => {
	it('returns an array of one key for BaseUser', () => {
		// Create user
		const user = new BaseUser();
		user.id = 1;

		// Get readable fields
		const searchableFields = getSearchableFields(user);

		// Expect result to be array of strings
		expect(searchableFields).toEqual(jasmine.any(Array));
		expect(searchableFields.length).toBeGreaterThanOrEqual(4);
		expect(searchableFields[0]).toEqual(jasmine.any(String));
	});
});
