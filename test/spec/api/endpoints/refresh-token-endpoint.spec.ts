import 'jasmine';
import { getRepository } from 'typeorm';
import { hashSync } from 'bcryptjs';

import { ExampleUser } from '../../../../src/models';
import { loginEndpoint, refreshTokenEndpoint } from '../../../../src/endpoints';
import { createMockRequest } from '../../../../src/test-probe';
import { jwtBearer } from '../../../../src/jwt-bearer';

/**
 * refreshTokenEndpoint()
 * pointyapi/endpoints
 */
describe('[Endpoints] Refresh Token', async () => {
	let credentials;

	beforeAll(async () => {
		// Create user
		const user = new ExampleUser();
		user.fname = 'RefreshToken';
		user.lname = 'Test';
		user.username = 'refreshTokentest';
		user.password = hashSync('password123', 12);
		user.email = 'refreshTokentest@example.com';

		await getRepository(ExampleUser)
			.save(user);

		// Create mock request/response
		const { request, response } = createMockRequest();

		request.body = {
			__user: 'refreshTokentest',
			password: 'password123',
			undefinedTest: undefined
		};

		// Run login endpoint
		credentials = false;
		response.json = (result) => {
			credentials = result;
		};

		await loginEndpoint(request, response);
	});

	it('[Login] can create a refresh token', async () => {
		if (credentials) {
			expect(credentials).toEqual(jasmine.any(ExampleUser));
			expect('refreshToken' in credentials).toBeTruthy();
			expect('refreshExpiration' in credentials).toBeTruthy();
			expect(typeof credentials['refreshToken']).toEqual('string');
			expect(typeof credentials['refreshExpiration']).toEqual(
				'number'
			);
		}
		else {
			fail('Could not create refresh token');
		}
	});

	it('can issue refreshed access token', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		request.body = {
			__refreshToken: credentials.refreshToken
		};

		// Run login endpoint
		let match = false;
		response.json = (result) => {
			match = result;
		};

		await refreshTokenEndpoint(request, response);

		if (match) {
			expect(match).toEqual(jasmine.any(ExampleUser));
			expect('token' in match).toBeTruthy();
			expect('expiration' in match).toBeTruthy();
			expect(typeof match['token']).toEqual('string');
			expect(typeof match['expiration']).toEqual('number');
		}
		else {
			fail('Could not run refreshTokenEndpoint');
		}
	});

	it('calls unauthorizedResponder() with wrong refresh token', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		request.body = {
			__refreshToken: 'wrong'
		};

		// Run refreshToken endpoint
		let match = false;
		response.json = fail;
		response.unauthorizedResponder = () => {
			match = true;
		};

		await refreshTokenEndpoint(request, response);

		expect(match).toBe(true);
	});

	it('calls unauthorizedResponder() with wrong token ID', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		const user = new ExampleUser();
		user.id = 0;

		request.body = {
			__refreshToken: jwtBearer.sign(user, true)
		};

		// Run refreshToken endpoint
		let match = false;
		response.json = fail;
		response.unauthorizedResponder = () => {
			match = true;
		};

		await refreshTokenEndpoint(request, response);

		expect(match).toBe(true);
	});

	it('calls validationResponder() without refresh token', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		request.body = {
			test: 'example'
		};

		// Run refreshToken endpoint
		let match = false;
		response.json = fail;
		response.validationResponder = () => {
			match = true;
		};

		await refreshTokenEndpoint(request, response);

		expect(match).toBe(true);
	});
});
