import { basicCors } from '../../../../src/middleware';
import { createMockRequest } from '../../../../src/test-probe';

/**
 * basicCors()
 * pointyapi/middleware
 */
describe('[Middleware] basicCors()', () => {
	it('sets the headers', () => {
		const headers = {};
		const { request, response } = createMockRequest();

		response.setHeader = (key, value) => {
			headers[key] = value;
		};

		basicCors(undefined, response, () => {
			expect(headers['Access-Control-Allow-Origin']).toEqual('*');
			expect(headers['Access-Control-Allow-Methods']).toEqual(
				'POST, GET, PATCH, DELETE, OPTIONS'
			);
			expect(headers['Access-Control-Allow-Credentials']).toEqual('true');
			expect(headers['Content-Type']).toEqual(
				'application/json;charset=utf-8'
			);
		});
	});
});
