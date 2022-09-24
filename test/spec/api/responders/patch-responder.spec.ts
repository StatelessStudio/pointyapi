import 'jasmine';
import { createMockRequest } from '../../../../src/test-probe';
import { patchResponder } from '../../../../src/responders';

/**
 * patchResponder()
 * pointyapi/responders
 */
describe('[Responders] patchResponder', () => {
	it('responds with a 200 on success', () => {
		const { request, response } = createMockRequest();

		let result = -1;
		response.sendStatus = (_result) => {
			result = _result;
		};

		patchResponder.bind({ response: response })({ message: 'Hello' });

		expect(result).toBe(204);
	});

	it('responds with error responder on failure', () => {
		const { request, response } = createMockRequest();

		// Override response methods
		let result = false;
		response.error = (error) => {
			result = true;
		};

		patchResponder.bind({ response: response })(undefined);

		expect(result).toEqual(true);
	});
});
