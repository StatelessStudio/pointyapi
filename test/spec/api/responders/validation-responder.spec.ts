import { createMockRequest } from '../../../../src/test-probe';
import { validationResponder } from '../../../../src/responders';

/**
 * validationResponder()
 * pointyapi/responders
 */
describe('[Responders] validationResponder', () => {
	it('passes the result with 400 status code', () => {
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

		validationResponder.bind({ response: response })({
			message: 'Hello'
		});

		expect(status).toBe(400);
		expect(result).toEqual(jasmine.any(Object));
		expect(result['validation']['message']).toBe('Hello');
	});
});
