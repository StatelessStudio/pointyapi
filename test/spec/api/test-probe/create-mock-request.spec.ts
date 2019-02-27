import { createMockRequest } from '../../../../src/test-probe';
import { BaseUser } from '../../../../src/models';

declare var fail;

/**
 * createMockRequest()
 * pointyapi/test-probe
 */
describe('[Test Probe] createMockRequest()', () => {
	beforeEach(() => {
		this.fail = fail;
	});

	afterEach(() => {
		fail = this.fail;
	});

	it('sets request', () => {
		const { request, response } = createMockRequest();
		expect(request).toEqual(jasmine.any(Object));
		expect(request.repository).toEqual(jasmine.any(Object));
		expect(request.method).toEqual('GET');
		expect(request.baseUrl).toEqual('/api/v1/user');
		expect(request.payloadType).toEqual(BaseUser);
		expect(request.joinMembers).toEqual(jasmine.any(Array));
		expect(request.identifier).toEqual('id');
	});

	it('sets response', () => {
		const { request, response } = createMockRequest();
		expect(response).toEqual(jasmine.any(Object));
		expect(response.conflictResponder).toEqual(jasmine.any(Function));
		expect(response.deleteResponder).toEqual(jasmine.any(Function));
		expect(response.forbiddenResponder).toEqual(jasmine.any(Function));
		expect(response.getResponder).toEqual(jasmine.any(Function));
		expect(response.error).toEqual(jasmine.any(Function));
		expect(response.goneResponder).toEqual(jasmine.any(Function));
		expect(response.postResponder).toEqual(jasmine.any(Function));
		expect(response.patchResponder).toEqual(jasmine.any(Function));
		expect(response.unauthorizedResponder).toEqual(jasmine.any(Function));
		expect(response.validationResponder).toEqual(jasmine.any(Function));
	});

	it('response responder functions fail by default', () => {
		const { request, response } = createMockRequest();
		const functions = [
			'conflictResponder',
			'deleteResponder',
			'forbiddenResponder',
			'getResponder',
			'error',
			'goneResponder',
			'postResponder',
			'patchResponder',
			'unauthorizedResponder',
			'validationResponder'
		];

		let nTests = 0;
		let nFails = 0;
		fail = () => nFails++;

		for (const func of functions) {
			if (response[func] instanceof Function) {
				response[func]();

				nTests++;
			}
			else {
				fail(func + ' is not a function.');
			}
		}

		expect(nFails).toBe(nTests);
		expect(nTests).toBeGreaterThanOrEqual(1);
	});
});
