import 'jasmine';
import { createMockRequest } from '../../../../src/test-probe';
import { deleteResponder } from '../../../../src/responders';

/**
 * deleteResponder()
 * pointyapi/responders
 */
describe('[Responders] deleteResponder', () => {
	it('responds with a 204 on success', () => {
		const { request, response } = createMockRequest();

		// Override response methods
		let status = -1;
		response.sendStatus = (code) => {
			status = code;

			return response;
		};

		deleteResponder.bind({ response: response })({ id: 12 });

		expect(status).toBe(204);
	});

	it('responds with error responder on failure', () => {
		const { request, response } = createMockRequest();

		// Override response methods
		let result = '';
		response.error = (error) => {
			result = error;
		};

		deleteResponder.bind({ response: response })(undefined);

		expect(result).toBe('Delete responder result is not an object.');
	});
});
