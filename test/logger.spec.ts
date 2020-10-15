import { Logger } from '../src/logger';

describe('Logger', () => {
	it('can create', () => {
		const logger = new Logger();
		expect(logger).toBeDefined();
	});

	it('allows debug mode', () => {
		const logger = new Logger(true);
		expect(logger.debug).toEqual(logger.info);
	});

	it('ignores debug logs when not in debug mode', () => {
		const logger = new Logger();
		expect(logger.debug('test')).toEqual(undefined);
	});
});
