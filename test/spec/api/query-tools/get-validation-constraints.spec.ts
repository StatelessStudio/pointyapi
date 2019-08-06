import { getValidationConstraints } from '../../../../src/query-tools';
import { User } from '../../../examples/terms/models/user';

/**
 * getValidationConstraints()
 * pointyapi/query-tools
 */
describe('[QueryTools] getValidationConstraints()', () => {
	it('returns a map of constraints for model', () => {
		const constraints = getValidationConstraints(User);

		expect(constraints).toEqual(jasmine.any(Object));
		expect('username' in constraints).toBe(true);
		expect(constraints.username.isAlphanumeric).toBe(true);
	});

	it('returns constraint for specific key', () => {
		const constraints = getValidationConstraints(User, 'username');

		expect(constraints).toEqual(jasmine.any(Object));
		expect(constraints.isAlphanumeric).toBe(true);
	});

	it('returns false if key has no constraints', () => {
		const constraints = getValidationConstraints(User, 'id');

		expect(constraints).toBe(false);
	});
});
