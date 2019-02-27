import { createMockRequest } from '../../../../src/test-probe';
import { getResponder } from '../../../../src/responders';

/**
 * getResponder()
 * pointyapi/responders
 */
describe('[Responders] getResponder', () => {
	it('responds with a 200 on success', () => {
		const { request, response } = createMockRequest();

		let result = false;
		response.json = (_result) => {
			result = _result;
		};

		getResponder.bind({ response: response })({ message: 'Hello' });

		expect(result).toEqual(jasmine.any(Object));
		expect(result['message']).toEqual('Hello');
	});

	it('responds with gone-responder on failure', () => {
		const { request, response } = createMockRequest();

		// Override response methods
		let result = false;
		response.goneResponder = (error) => {
			result = true;
		};

		getResponder.bind({ response: response })(undefined);

		expect(result).toEqual(true);
	});
});
