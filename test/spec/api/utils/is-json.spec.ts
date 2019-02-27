import { isJson } from '../../../../src/utils';

/**
 * isJson()
 * pointyapi/utils
 */
describe('[Utils] isJson()', () => {
	it('returns true if the object is valid', () => {
		const obj = '{"item": 1}';
		expect(isJson(obj)).toBe(true);
	});

	it('returns false if the object is not valid', () => {
		const obj = 'notvalid';
		expect(isJson(obj)).toBe(false);
	});
});
