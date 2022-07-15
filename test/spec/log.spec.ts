import 'jasmine';
import { log } from '../../src/log';

describe('Log', () => {
	it('exports an instance', () => {
		expect(log).toBeDefined();
	});
});
