import 'jasmine';
import { createTimestamp } from '../../../../src/utils';

/**
 * createTimestamp()
 * pointyapi/utils
 */
describe('[Utils] createTimestamp()', () => {
	it('returns a timestamp', () => {
		const time: string = createTimestamp();
		const regex = new RegExp(
			/\[[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{1,4} [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}\]/
		);

		expect(regex.test(time)).toBe(true);
	});
});
