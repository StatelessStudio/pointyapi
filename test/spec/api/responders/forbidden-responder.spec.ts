import 'jasmine';
import { createMockRequest } from '../../../../src/test-probe';
import { forbiddenResponder } from '../../../../src/responders';

/**
 * forbiddenResponder()
 * pointyapi/responders
 */
describe('[Responders] forbiddenResponder', () => {
	it('passes the result with 403 status code', () => {
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

		forbiddenResponder.bind({ response: response })({ message: 'Hello' });

		expect(status).toBe(403);
		expect(result).toEqual(jasmine.any(Object));
		expect(result['message']).toBe('Hello');
	});
});
