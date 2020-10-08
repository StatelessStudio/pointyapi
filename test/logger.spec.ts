import 'jasmine';

import { Logger } from '../src/logger';

describe('Logger', () => {
	it('can create', () => {
		const logger = new Logger();
		expect(logger).toBeDefined();
	});
});
