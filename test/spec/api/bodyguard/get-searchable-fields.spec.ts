import 'jasmine';
import { ExampleUser } from '../../../../src/models';
import { getSearchableFields } from '../../../../src/bodyguard';

/**
 * getSearchableFields()
 * pointyapi/bodyguard
 */
describe('[Bodyguard] getSearchableFields', () => {
	it('returns an array of one key for ExampleUser', () => {
		// Create user
		const user = new ExampleUser();
		user.id = 1;

		// Get readable fields
		const searchableFields = getSearchableFields(user);

		// Expect result to be array of strings
		expect(searchableFields).toEqual(jasmine.any(Array));
		expect(searchableFields.length).toBeGreaterThanOrEqual(4);
		expect(searchableFields[0]).toEqual(jasmine.any(String));
	});
});
