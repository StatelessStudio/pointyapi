import 'jasmine';
import { createMockRequest } from '../../../../src/test-probe';
import { unauthorizedResponder } from '../../../../src/responders';

/**
 * unauthorizedResponder()
 * pointyapi/responders
 */
describe('[Responders] unauthorizedResponder', () => {
	it('passes the result with 401 status code', () => {
		const { request, response } = createMockRequest();

		// Override response methods
		let status = -1;
		response.status = (code) => {
			status = code;

			return response;
		};

		let result = false;
		response.json = (_result) => {
			result = _result;

			return response;
		};

		unauthorizedResponder.bind({ response: response })({
			message: 'Hello'
		});

		expect(status).toBe(401);
		expect(result).toEqual(jasmine.any(Object));
		expect(result['message']).toBe('Hello');
	});
});
