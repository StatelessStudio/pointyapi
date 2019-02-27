import { deleteUndefinedMembers } from '../../../../src/utils';

/**
 * deleteUndefinedMembers()
 * pointyapi/utils
 */
describe('[Utils] deleteUndefinedMembers()', () => {
	beforeAll(() => {
		this.obj = deleteUndefinedMembers({ first: 1, second: undefined });
	});

	it('deletes undefined members', () => {
		if ('second' in this.obj) {
			fail('Did not delete undefined member');
		}
	});

	it('leaves defined members', () => {
		if (!('first' in this.obj)) {
			fail('Deleted defined member');
		}
	});
});
