import 'jasmine';
import { ExampleUser } from '../../../../src/models';
import { getReadableFields } from '../../../../src/bodyguard';

/**
 * getReadableFields()
 * pointyapi/bodyguard
 */
describe('[Bodyguard] getReadableFields', () => {
	it('returns an array of one key for ExampleUser', () => {
		// Create user
		const user = new ExampleUser();
		user.id = 1;

		// Get readable fields
		const readableFields = getReadableFields(user, user);

		// Expect result to be array of strings
		expect(readableFields).toEqual(jasmine.any(Array));
		expect(readableFields.length).toBeGreaterThanOrEqual(1);
		expect(readableFields[0]).toEqual(jasmine.any(String));
	});
});
