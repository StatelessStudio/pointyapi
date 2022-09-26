import { IsInt } from 'class-validator';
import 'jasmine';
import { BaseModel } from 'models';
import { isIntString, validateAllowingStrings } from '../../../../src/validation';

/**
 * isIntString()
 * pointyapi/validation
 */
describe('[Validation] isIntString()', () => {
	it('returns true if string is int', () => {
		for (const test of [ '1', '0', '-1', '123', '-123', '99999999999999']) {
			expect(isIntString(test)).withContext(test).toBeTrue();
		}
	});

	it('returns false if string is not int', () => {
		for (const test of [ '1a', '0x', '-', '%', 'hello', 'a']) {
			expect(isIntString(test)).withContext(test).toBeFalse();
		}
	});
});

/**
 * validateAllowingStrings()
 * pointyapi/validation
 */
class ValidationTestModel {
	@IsInt()
	public intprop: number | string = undefined;
}

describe('[Validation] validateAllowingStrings()', () => {
	it('can allow strings that are ints', () => {
		const obj = new ValidationTestModel();
		obj.intprop = '123';
		const result = validateAllowingStrings(obj);

		expect(Array.isArray(result)).withContext('returns array').toBeTrue();
		expect(result.length).withContext('number of errors').toBe(0);
	});

	it('does not allow strings that are not ints', () => {
		const obj = new ValidationTestModel();
		obj.intprop = 'abc';
		const result = validateAllowingStrings(obj);

		expect(Array.isArray(result)).withContext('returns array').toBeTrue();
		expect(result.length).withContext('number of errors').toBe(1);
	});
});
