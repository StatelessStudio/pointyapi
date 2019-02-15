import { forkServer } from '../../../../src/utils';

import { pointy } from '../../../../src/';
import { HttpClientResponse } from '../../../../src/http/http-client-response';
const http = pointy.http;

/**
 * HTTP Client
 * pointyapi/http
 */
describe('[HTTP] HTTP Client', () => {
	beforeAll(async () => {
		this.serverfork = await forkServer(
			'./lib/test/examples/basic/server.js'
		);
	});

	afterAll(() => {
		if (this.serverfork) {
			this.serverfork.kill();
		}
	});

	it('can get', async () => {
		const result: void | HttpClientResponse = await http
			.get('/', {}, [ 404 ], 'Bearer: test')
			.catch((error) => fail(JSON.stringify(error)));

		if (result) {
			expect(result.statusCode).toBe(404);
		}
		else {
			fail('Http responded with void result');
		}
	});

	it('get rejects if the expected status code is not met', async () => {
		let hasError = false;

		const result: boolean | HttpClientResponse = await http
			.get('/', {}, [ 200 ])
			.catch((error) => (hasError = true));

		expect(hasError).toBe(true);
	});

	it('can post', async () => {
		const result: void | HttpClientResponse = await http
			.post('/', {}, [ 404 ], 'Bearer: test')
			.catch((error) => fail(JSON.stringify(error)));

		if (result) {
			expect(result.statusCode).toBe(404);
		}
		else {
			fail('Http responded with void result');
		}
	});

	it('post rejects if the expected status code is not met', async () => {
		let hasError = false;

		const result: boolean | HttpClientResponse = await http
			.post('/', {}, [ 200 ])
			.catch((error) => (hasError = true));

		expect(hasError).toBe(true);
	});

	it('can put', async () => {
		const result: void | HttpClientResponse = await http
			.put('/', {}, [ 404 ], 'Bearer: test')
			.catch((error) => fail(JSON.stringify(error)));

		if (result) {
			expect(result.statusCode).toBe(404);
		}
		else {
			fail('Http responded with void result');
		}
	});

	it('put rejects if the expected status code is not met', async () => {
		let hasError = false;

		const result: boolean | HttpClientResponse = await http
			.put('/', {}, [ 200 ])
			.catch((error) => (hasError = true));

		expect(hasError).toBe(true);
	});

	it('can delete', async () => {
		const result: void | HttpClientResponse = await http
			.delete('/', [ 404 ], 'Bearer: test')
			.catch((error) => fail(JSON.stringify(error)));

		if (result) {
			expect(result.statusCode).toBe(404);
		}
		else {
			fail('Http responded with void result');
		}
	});

	it('delete rejects if the expected status code is not met', async () => {
		let hasError = false;

		const result: boolean | HttpClientResponse = await http
			.delete('/', [ 200 ])
			.catch((error) => (hasError = true));

		expect(hasError).toBe(true);
	});
});
