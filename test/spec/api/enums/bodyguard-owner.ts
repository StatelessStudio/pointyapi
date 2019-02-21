import { BodyguardOwner } from '../../../../src/enums';

/**
 * UserRole
 * pointyapi/enums
 */
describe('[Enum] UserRole', () => {
	it('contains Anyone', () => {
		expect(BodyguardOwner.Anyone).toEqual('__anyone__');
	});

	it('contains Self', () => {
		expect(BodyguardOwner.Self).toEqual('__self__');
	});

	it('contains Admin', () => {
		expect(BodyguardOwner.Admin).toEqual('__admin__');
	});
});
