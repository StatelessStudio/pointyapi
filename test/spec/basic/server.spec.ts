import 'jasmine';

import { pointy } from '../../../src/';
import { forkServer } from '../../../src/utils/fork-server';

const http = pointy.http;

let serverfork;

beforeAll(async () => {
	serverfork = await forkServer('./dist/test/examples/basic/server.js');

	// Database
	await pointy.db
		.connect()
		.catch((error) =>
			fail('Cannot start database' + JSON.stringify(error))
		);
});

afterAll(() => {
	if (serverfork) {
		serverfork.kill();
	}
});

describe('API Server', () => {
	it('is running', async () => {
		await http
			.get('/', {}, undefined, [ 200, 404 ])
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('sends proper headers', async () => {
		const result = await http
			.get('/', {}, undefined, [ 200, 404 ])
			.catch((error) => fail(JSON.stringify(error)));

		if (result) {
			expect(
				'access-control-allow-origin' in result.response.headers
			).toBeTruthy();
			expect(
				'access-control-allow-methods' in result.response.headers
			).toBeTruthy();
			expect(
				'access-control-allow-headers' in result.response.headers
			).toBeTruthy();
			expect(
				'access-control-allow-credentials' in result.response.headers
			).toBeTruthy();
			expect('content-type' in result.response.headers).toBeTruthy();
			expect(
				'content-security-policy' in result.response.headers
			).toBeTruthy();
			expect(
				'x-content-type-options' in result.response.headers
			).toBeTruthy();
			expect('content-length' in result.response.headers).toBeTruthy();

			expect('x-powered-by' in result.response.headers).toBeFalsy();
		}
		else {
			fail('Request failed');
		}
	});
});
