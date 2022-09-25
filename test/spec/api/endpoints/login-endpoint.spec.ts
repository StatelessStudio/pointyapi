import 'jasmine';
import { getConnection, getRepository } from 'typeorm';
import { hashSync } from 'bcryptjs';

import { ExampleUser } from '../../../../src/models';
import { loginEndpoint } from '../../../../src/endpoints';
import { createMockRequest } from '../../../../src/test-probe';
import { HookTestClass } from '../../../examples/api/models/hook-test-class';
import { addResource } from '../../../../src/utils';

/**
 * loginEndpoint()
 * pointyapi/endpoints
 */
describe('[Endpoints] Login', async () => {
	let cwarn;

	beforeEach(() => {
		cwarn = console.warn;
		console.warn = () => {};
	});

	afterEach(() => {
		console.warn = cwarn;
	});

	beforeAll(async () => {
		// Create user
		const user = new ExampleUser();
		user.fname = 'Login';
		user.lname = 'Test';
		user.username = 'logintest';
		user.password = hashSync('password123', 12);
		user.email = 'logintest@example.com';

		await getRepository(ExampleUser)
			.save(user);
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
			expect(match).toEqual(jasmine.any(ExampleUser));
			expect(match['username']).toEqual('logintest');
			expect(request.user).toEqual(jasmine.any(ExampleUser));
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
			username: 'loginHook',
			password: hashSync('password123'),
			fname: 'login',
			lname: 'hook',
			email: 'login@example.com'
		}).catch((error) =>
			fail('Could not create user ' + JSON.stringify(error))
		);

		// Create mock request/response
		const { request, response } = createMockRequest('POST');

		let result = '';
		request.hookShouldPass = true;
		request.hookCallback = (name) => (result = name);

		request.userType = HookTestClass;
		request.payloadType = HookTestClass;
		request.repository = getRepository(HookTestClass);
		request.body = Object.assign(new HookTestClass(), {
			__user: 'loginHook',
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
