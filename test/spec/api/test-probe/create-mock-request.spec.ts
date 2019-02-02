import { createMockRequest } from '../../../../src/test-probe';
import { BaseUser } from '../../../../src/models';

/**
 * createMockRequest()
 * pointyapi/test-probe
 */
describe('[Test Probe] createMockRequest()', () => {
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
		expect(response.putResponder).toEqual(jasmine.any(Function));
		expect(response.unauthorizedResponder).toEqual(jasmine.any(Function));
		expect(response.validationResponder).toEqual(jasmine.any(Function));
	});
});
