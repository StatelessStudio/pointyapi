import { getRepository } from 'typeorm';
import { hashSync } from 'bcryptjs';

import { BaseUser } from '../../../../src/models';
import { loginEndpoint, refreshTokenEndpoint } from '../../../../src/endpoints';
import { createMockRequest } from '../../../../src/test-probe';
import { jwtBearer } from '../../../../src/jwt-bearer';

/**
 * refreshTokenEndpoint()
 * pointyapi/endpoints
 */
describe('[Endpoints] Refresh Token', async () => {
	beforeEach(() => {
		this.cwarn = console.warn;
		console.warn = () => {};
	});

	afterEach(() => {
		console.warn = this.cwarn;
	});

	beforeAll(async () => {
		// Create user
		const user = new BaseUser();
		user.fname = 'RefreshToken';
		user.lname = 'Test';
		user.username = 'refreshTokentest';
		user.password = hashSync('password123', 12);
		user.email = 'refreshTokentest@example.com';

		await getRepository(BaseUser)
			.save(user)
			.catch((error) => fail(JSON.stringify(error)));

		// Create mock request/response
		const { request, response } = createMockRequest();

		request.body = {
			__user: 'refreshTokentest',
			password: 'password123',
			undefinedTest: undefined
		};

		// Run login endpoint
		this.credentials = false;
		response.json = (result) => {
			this.credentials = result;
		};

		await loginEndpoint(request, response);
	});

	it('[Login] can create a refresh token', async () => {
		if (this.credentials) {
			expect(this.credentials).toEqual(jasmine.any(BaseUser));
			expect('refreshToken' in this.credentials).toBeTruthy();
			expect('refreshExpiration' in this.credentials).toBeTruthy();
			expect(typeof this.credentials['refreshToken']).toEqual('string');
			expect(typeof this.credentials['refreshExpiration']).toEqual(
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
			refreshToken: this.credentials.refreshToken
		};

		// Run login endpoint
		let match = false;
		response.json = (result) => {
			match = result;
		};

		await refreshTokenEndpoint(request, response);

		if (match) {
			expect(match).toEqual(jasmine.any(BaseUser));
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
			refreshToken: 'wrong'
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

		const user = new BaseUser();
		user.id = 0;

		request.body = {
			refreshToken: jwtBearer.sign(user, true)
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
