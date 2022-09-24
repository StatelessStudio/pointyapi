import 'jasmine';
import { userTestProbe } from '../../../../src/test-probe';
import { createMockRequest } from '../../../../src/test-probe';

/**
 * userTestProbe()
 * pointyapi/test-probe
 */
describe('[Test Probe] userTestProbe()', () => {
	let clog;

	beforeAll(() => {
		clog = console.log;
		console.log = () => {};
	});

	afterAll(() => {
		console.log = clog;
	});

	it('logs', () => {
		const { request, response } = createMockRequest();

		let result = false;
		console.log = () => {
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
