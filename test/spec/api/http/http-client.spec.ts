import { forkServer } from '../../../../src/utils';

import { pointy } from '../../../../src/';
import { HttpClientResponse } from '../../../../src/http/http-client-response';
const http = pointy.http;

/**
 * HTTP Client
 * pointyapi/http
 */
describe('[HTTP] HTTP Client', () => {
	let serverfork;

	beforeAll(async () => {
		serverfork = await forkServer(
			'./lib/test/examples/basic/server.js'
		);
	});

	afterAll(() => {
		if (serverfork) {
			serverfork.kill();
		}
	});

	it('can get', async () => {
		const result: void | HttpClientResponse = await http
			.get('/', {}, 'Bearer: test', [ 404 ])
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
			.get('/', {})
			.catch((error) => (hasError = true));

		expect(hasError).toBe(true);
	});

	it('can post', async () => {
		const result: void | HttpClientResponse = await http
			.post('/', {}, 'Bearer: test', [ 404 ])
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
			.post('/', {})
			.catch((error) => (hasError = true));

		expect(hasError).toBe(true);
	});

	it('can patch', async () => {
		const result: void | HttpClientResponse = await http
			.patch('/', {}, 'Bearer: test', [ 404 ])
			.catch((error) => fail(JSON.stringify(error)));

		if (result) {
			expect(result.statusCode).toBe(404);
		}
		else {
			fail('Http responded with void result');
		}
	});

	it('patch rejects if the expected status code is not met', async () => {
		let hasError = false;

		const result: boolean | HttpClientResponse = await http
			.patch('/', {})
			.catch((error) => (hasError = true));

		expect(hasError).toBe(true);
	});

	it('can delete', async () => {
		const result: void | HttpClientResponse = await http
			.delete('/', 'Bearer: test', [ 404 ])
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
			.delete('/')
			.catch((error) => (hasError = true));

		expect(hasError).toBe(true);
	});
});
