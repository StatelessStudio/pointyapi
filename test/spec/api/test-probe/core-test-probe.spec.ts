import 'jasmine';
import { Log } from 'ts-tiny-log';
import { LogLevel } from 'ts-tiny-log/levels';
import { log, setLog } from '../../../../src/log';
import { coreTestProbe } from '../../../../src/test-probe';
import { createMockRequest } from '../../../../src/test-probe';

/* eslint-disable-rule no-console */

/**
 * coreTestProbe()
 * pointyapi/test-probe
 */
describe('[Test Probe] coreTestProbe()', () => {
	let clog: Log;

	beforeAll(() => {
		clog = log;
		setLog(new Log({
			level: LogLevel.debug,
		}));

		log.setWriter(LogLevel.debug, (...args) => {});
	});

	afterAll(() => {
		setLog(clog);
	});

	it('logs', () => {
		const { request, response } = createMockRequest();

		let result = false;
		log.debug = () => {
			result = true;
		};

		coreTestProbe(request, response, () => {});

		expect(result).toBe(true);
	});

	it('calls next', () => {
		const { request, response } = createMockRequest();

		let result = false;
		const next = () => {
			result = true;
		};

		coreTestProbe(request, response, next);

		expect(result).toBe(true);
	});
});
