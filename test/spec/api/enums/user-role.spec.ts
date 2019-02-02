import { UserRole } from '../../../../src/enums';

/**
 * UserRole
 * pointyapi/enums
 */
describe('[Enum] UserRole', () => {
	it('contains Guest', () => {
		expect(UserRole.Guest).toEqual('guest');
	});

	it('contains Basic', () => {
		expect(UserRole.Basic).toEqual('basic');
	});

	it('contains Member', () => {
		expect(UserRole.Member).toEqual('member');
	});

	it('contains Admin', () => {
		expect(UserRole.Admin).toEqual('admin');
	});

	it('contains Developer', () => {
		expect(UserRole.Developer).toEqual('developer');
	});
});
