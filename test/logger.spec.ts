import { Logger } from '../src/logger';

describe('Logger', () => {
	it('can create', () => {
		const logger = new Logger();
		expect(logger).toBeDefined();
	});

	it('allows debug mode', async () => {
		const logger = new Logger(true);
		expect(logger.debug).toEqual(logger.info);
	});
});
