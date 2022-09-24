import 'jasmine';
import { createMockRequest } from '../../../../src/test-probe';
import { conflictResponder } from '../../../../src/responders';

/**
 * conflictResponder()
 * pointyapi/responders
 */
describe('[Responders] conflictResponder', () => {
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

		conflictResponder.bind({ response: response })({ message: 'Hello' });

		expect(status).toBe(409);
		expect(result).toEqual(jasmine.any(Object));
		expect(result['message']).toBe('Hello');
	});
});
