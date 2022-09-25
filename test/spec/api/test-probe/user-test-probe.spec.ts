import 'jasmine';
import { Log } from 'ts-tiny-log';
import { LogLevel } from 'ts-tiny-log/levels';
import { log, setLog } from '../../../../src/log';
import { userTestProbe } from '../../../../src/test-probe';
import { createMockRequest } from '../../../../src/test-probe';

/**
 * userTestProbe()
 * pointyapi/test-probe
 */
describe('[Test Probe] userTestProbe()', () => {
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

		userTestProbe(request, response, () => {});

		expect(result).toBe(true);
	});

	it('calls next', () => {
		const { request, response } = createMockRequest();

		let result = false;
		const next = () => {
			result = true;
		};

		userTestProbe(request, response, next);

		expect(result).toBe(true);
	});
});
