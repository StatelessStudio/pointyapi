import { isDefined } from '../../../../src/utils';

/**
 * isDefined()
 * pointyapi/utils
 */
describe('[Utils] isDefined()', () => {
	it('returns true if the item is defined', () => {
		const item = 1;
		expect(isDefined(item)).toBe(true);
	});

	it('returns true if the item is defined false', () => {
		const item = false;
		expect(isDefined(item)).toBe(true);
	});

	it('returns false if the item is not defined', () => {
		const obj = { definedOne: 1 };
		expect(isDefined(obj['definedTwo'])).toBe(false);
	});

	it('returns false if the item is undefined', () => {
		const item = undefined;
		expect(isDefined(item)).toBe(false);
	});

	it('returns false if the item is null', () => {
		const item = null;
		expect(isDefined(item)).toBe(false);
	});
});
