import { deleteUndefinedMembers } from '../../../../src/utils';

/**
 * deleteUndefinedMembers()
 * pointyapi/utils
 */
describe('[Utils] deleteUndefinedMembers()', () => {
	let obj;

	beforeAll(() => {
		obj = deleteUndefinedMembers({ first: 1, second: undefined });
	});

	it('deletes undefined members', () => {
		if ('second' in obj) {
			fail('Did not delete undefined member');
		}
	});

	it('leaves defined members', () => {
		if (!('first' in obj)) {
			fail('Deleted defined member');
		}
	});
});
