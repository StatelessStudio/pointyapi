import { getRepository } from 'typeorm';
import { hashSync } from 'bcryptjs';

import { BaseUser } from '../../../../src/models';
import { loginEndpoint } from '../../../../src/endpoints';
import { createMockRequest } from '../../../../src/test-probe';
import { HookTestClass } from '../../../examples/api/models/hook-test-class';
import { addResource } from '../../../../src/utils';

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
		user.tempPassword = hashSync('password123', 12);
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
			password: 'password123',
			undefinedTest: undefined
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

	it('runs login hook', async () => {
		await addResource(HookTestClass, {
			username: 'login',
			password: hashSync('password123'),
			fname: 'login',
			lnmae: 'hook',
			email: 'login@example.com'
		}).catch((error) =>
			fail('Could not create user ' + JSON.stringify(error))
		);

		// Create mock request/response
		const { request, response } = createMockRequest('POST');

		let result = '';
		request.hookShouldPass = true;
		request.hookCallback = (name) => (result = name);

		request.payloadType = HookTestClass;
		request.repository = getRepository(HookTestClass);
		request.body = Object.assign(new HookTestClass(), {
			__user: 'login',
			password: 'password123'
		});

		await loginEndpoint(request, response);

		expect(result).toBe('login');
	});

	it('calls response.error if login hook fails', async () => {
		await addResource(HookTestClass, {
			username: 'loginFail',
			password: hashSync('password123'),
			fname: 'login',
			lnmae: 'hook',
			email: 'loginFail@example.com'
		}).catch((error) =>
			fail('Could not create user ' + JSON.stringify(error))
		);

		// Create mock request/response
		const { request, response } = createMockRequest('POST');

		let result = '';
		let hasError = '';
		request.hookShouldPass = false;
		request.hookCallback = (name) => (result = name);
		response.error = (error) => {
			hasError = error;
		};

		request.payloadType = HookTestClass;
		request.repository = getRepository(HookTestClass);
		request.body = Object.assign(new HookTestClass(), {
			__user: 'loginFail',
			password: 'password123'
		});

		await loginEndpoint(request, response);

		expect(result).toBe('login');
		expect(hasError).toBe('Could not complete hook');
	});
});
