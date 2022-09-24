import 'jasmine';
import { requestTestProbe } from '../../../../src/test-probe';
import { createMockRequest } from '../../../../src/test-probe';

/**
 * requestTestProbe()
 * pointyapi/test-probe
 */
describe('[Test Probe] requestTestProbe()', () => {
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

		requestTestProbe(request, response, () => {});

		expect(result).toBe(true);
	});

	it('calls next', () => {
		const { request, response } = createMockRequest();

		let result = false;
		const next = () => {
			result = true;
		};

		requestTestProbe(request, response, next);

		expect(result).toBe(true);
	});
});
