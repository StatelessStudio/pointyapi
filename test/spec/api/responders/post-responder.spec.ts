import 'jasmine';
import { createMockRequest } from '../../../../src/test-probe';
import { postResponder } from '../../../../src/responders';

/**
 * postResponder()
 * pointyapi/responders
 */
describe('[Responders] postResponder', () => {
	it('responds with a 200 on success', () => {
		const { request, response } = createMockRequest();

		let result = false;
		response.json = (_result) => {
			result = _result;
		};

		postResponder.bind({ response: response })({ message: 'Hello' });

		expect(result).toEqual(jasmine.any(Object));
		expect(result['message']).toEqual('Hello');
	});

	it('responds with error responder on failure', () => {
		const { request, response } = createMockRequest();

		// Override response methods
		let result = false;
		response.error = (error) => {
			result = true;
		};

		postResponder.bind({ response: response })(undefined);

		expect(result).toEqual(true);
	});
});
