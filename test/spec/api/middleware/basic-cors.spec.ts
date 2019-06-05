import { basicCors } from '../../../../src/middleware';
import { createMockRequest } from '../../../../src/test-probe';

/**
 * basicCors()
 * pointyapi/middleware
 */
describe('[Middleware] basicCors()', () => {
	it('sets the headers', () => {
		delete process.env.CLIENT_URL;
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

	it('accepts environment CLIENT_URL', () => {
		process.env.CLIENT_URL = 'test.com';
		const headers = {};
		const { request, response } = createMockRequest();

		response.setHeader = (key, value) => {
			headers[key] = value;
		};

		basicCors(request, response, () => {
			expect(headers['Access-Control-Allow-Origin']).toEqual(
				process.env.CLIENT_URL
			);
		});
	});

	it('accepts environment CLIENT_URL as array', () => {
		process.env.CLIENT_URL = 'test.com, localhost, test2.com';
		const headers = {};
		const { request, response } = createMockRequest();

		response.setHeader = (key, value) => {
			headers[key] = value;
		};

		basicCors(request, response, () => {
			expect(headers['Access-Control-Allow-Origin']).toEqual('localhost');
		});
	});

	it('rejects environment CLIENT_URL as array without match', () => {
		process.env.CLIENT_URL = 'test.com, test2.com';
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
