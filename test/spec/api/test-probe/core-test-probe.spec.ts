import { coreTestProbe } from '../../../../src/test-probe';
import { createMockRequest } from '../../../../src/test-probe';

/**
 * coreTestProbe()
 * pointyapi/test-probe
 */
describe('[Test Probe] coreTestProbe()', () => {
	beforeAll(() => {
		this.clog = console.log;
		console.log = () => {};
	});

	afterAll(() => {
		console.log = this.clog;
	});

	it('logs', () => {
		const { request, response } = createMockRequest();

		let result = false;
		console.log = () => {
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
