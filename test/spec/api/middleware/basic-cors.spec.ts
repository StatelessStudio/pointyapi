import { env } from '../../../../src/environment';
import { basicCors } from '../../../../src/middleware';
import { createMockRequest } from '../../../../src/test-probe';

/**
 * basicCors()
 * pointyapi/middleware
 */
describe('[Middleware] basicCors()', () => {
	it('sets the headers', () => {
		const allowed = null;
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
		}, allowed);
	});

	it('accepts environment ALLOW_ORIGIN', () => {
		const allowed = 'test.com';
		const headers = {};
		const { request, response } = createMockRequest();

		response.setHeader = (key, value) => {
			headers[key] = value;
		};

		basicCors(request, response, () => {
			expect(headers['Access-Control-Allow-Origin']).toEqual(
				allowed
			);
		}, allowed);
	});

	it('accepts environment ALLOW_ORIGIN as array', () => {
		const allowed = 'test.com, localhost, test2.com';
		const headers = {};
		const { request, response } = createMockRequest();

		response.setHeader = (key, value) => {
			headers[key] = value;
		};

		basicCors(request, response, () => {
			expect(headers['Access-Control-Allow-Origin']).toEqual('test.com');
		}, allowed);
	});

	it('rejects environment ALLOW_ORIGIN as array without match', () => {
		const allowed = 'test.com, test2.com';
		const headers = {};
		const { request, response } = createMockRequest();

		response.setHeader = (key, value) => {
			headers[key] = value;
		};

		basicCors(request, response, () => {
			expect(headers['Access-Control-Allow-Origin']).toEqual('test.com');
		}, allowed);
	});
});
