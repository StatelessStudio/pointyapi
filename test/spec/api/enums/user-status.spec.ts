import 'jasmine';
import { UserStatus } from '../../../../src/enums';

/**
 * UserStatus
 * pointyapi/enums
 */
describe('[Enum] UserStatus', () => {
	it('contains Active', () => {
		expect(UserStatus.Active).toEqual('active');
	});

	it('contains Pending', () => {
		expect(UserStatus.Pending).toEqual('pending');
	});

	it('contains Banned', () => {
		expect(UserStatus.Banned).toEqual('banned');
	});
});
