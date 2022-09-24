import 'jasmine';
import { createMockRequest } from '../../../../src/test-probe';
import { goneResponder } from '../../../../src/responders';

/**
 * goneResponder()
 * pointyapi/responders
 */
describe('[Responders] goneResponder', () => {
	it('passes the result with 409 status code', () => {
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

		goneResponder.bind({ response: response })({ message: 'Hello' });

		expect(status).toBe(410);
		expect(result).toEqual(jasmine.any(Object));
		expect(result['message']).toBe('Hello');
	});
});
