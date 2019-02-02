import { getRepository } from 'typeorm';
import { hashSync } from 'bcryptjs';

import { BaseUser } from '../../../../src/models';
import { loginEndpoint } from '../../../../src/endpoints';
import { createMockRequest } from '../../../../src/test-probe';

/**
 * loginEndpoint()
 * pointyapi/endpoints
 */
describe('[Endpoints] Login', async () => {
	beforeAll(async () => {
		// Create user
		const user = new BaseUser();
		user.fname = 'Login';
		user.lname = 'Test';
		user.username = 'logintest';
		user.password = hashSync('password123', 12);
		user.email = 'logintest@example.com';

		await getRepository(BaseUser)
			.save(user)
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can create a login token', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		request.body = {
			__user: 'logintest',
			password: 'password123'
		};

		// Run login endpoint
		let match = false;
		response.json = (result) => {
			match = result;
		};

		await loginEndpoint(request, response);

		if (match) {
			expect(match).toEqual(jasmine.any(BaseUser));
			expect(match['username']).toEqual('logintest');
			expect(request.user).toEqual(jasmine.any(BaseUser));
			expect(request.user['username']).toEqual('logintest');
		}
		else {
			fail('Could not login');
		}
	});

	it('calls unauthorizedResponder() with wrong username', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		request.body = {
			__user: 'loginWrong',
			password: 'password123'
		};

		// Run login endpoint
		let match = false;
		response.json = fail;
		response.unauthorizedResponder = () => {
			match = true;
		};

		await loginEndpoint(request, response);

		expect(match).toBe(true);
	});

	it('calls unauthorizedResponder() with wrong password', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		request.body = {
			__user: 'logintest',
			password: 'password321'
		};

		// Run login endpoint
		let match = false;
		response.json = fail;
		response.unauthorizedResponder = () => {
			match = true;
		};

		await loginEndpoint(request, response);

		expect(match).toBe(true);
	});
});
