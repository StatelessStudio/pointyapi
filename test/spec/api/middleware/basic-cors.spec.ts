import { basicCors } from '../../../../src/middleware';
import { createMockRequest } from '../../../../src/test-probe';

/**
 * basicCors()
 * pointyapi/middleware
 */
describe('[Middleware] basicCors()', () => {
	it('sets the headers', () => {
		delete process.env.ALLOW_ORIGIN;
		const headers = {};
		const { request, response } = createMockRequest();

		response.setHeader = (key, value) => {
			headers[key] = value;
		};

		basicCors(request, response, () => {
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

	it('accepts environment ALLOW_ORIGIN', () => {
		process.env.ALLOW_ORIGIN = 'test.com';
		const headers = {};
		const { request, response } = createMockRequest();

		response.setHeader = (key, value) => {
			headers[key] = value;
		};

		basicCors(request, response, () => {
			expect(headers['Access-Control-Allow-Origin']).toEqual(
				process.env.ALLOW_ORIGIN
			);
		});
	});

	it('accepts environment ALLOW_ORIGIN as array', () => {
		process.env.ALLOW_ORIGIN = 'test.com, localhost, test2.com';
		const headers = {};
		const { request, response } = createMockRequest();

		response.setHeader = (key, value) => {
			headers[key] = value;
		};

		basicCors(request, response, () => {
			expect(headers['Access-Control-Allow-Origin']).toEqual('test.com');
		});
	});

	it('rejects environment ALLOW_ORIGIN as array without match', () => {
		process.env.ALLOW_ORIGIN = 'test.com, test2.com';
		const headers = {};
		const { request, response } = createMockRequest();

		response.setHeader = (key, value) => {
			headers[key] = value;
		};

		basicCors(request, response, () => {
			expect(headers['Access-Control-Allow-Origin']).toEqual('test.com');
		});
	});
});
