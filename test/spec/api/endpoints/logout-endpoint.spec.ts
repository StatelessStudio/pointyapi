import 'jasmine';
import { getRepository } from 'typeorm';
import { hashSync } from 'bcryptjs';

import { ExampleUser } from '../../../../src/models';
import { logoutEndpoint, loginEndpoint } from '../../../../src/endpoints';
import { createMockRequest } from '../../../../src/test-probe';
import { HookTestClass } from '../../../examples/api/models/hook-test-class';
import { addResource } from '../../../../src/utils';

/**
 * logoutEndpoint()
 * pointyapi/endpoints
 */
describe('[Endpoints] Logout', async () => {
	beforeAll(async () => {
		// Create user
		const user = new ExampleUser();
		user.fname = 'Logout';
		user.lname = 'Test';
		user.username = 'logouttest';
		user.password = hashSync('password123', 12);
		user.email = 'logouttest@example.com';

		await getRepository(ExampleUser)
			.save(user);
	});

	it('can logout', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		request.body = {
			__user: 'logouttest',
			password: 'password123'
		};

		// Login
		await loginEndpoint(request, response);

		// Run logout endpoint
		let match = false;
		response.deleteResponder = (result) => {
			match = result;
		};

		await logoutEndpoint(request, response);

		expect(match).toBeTruthy();
	});

	it('calls unauthorizedResponder() if not logged in', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Run logout endpoint
		let match = false;
		response.unauthorizedResponder = () => {
			match = true;
		};

		await logoutEndpoint(request, response);

		if (match) {
			expect(match).toBe(true);
		}
		else {
			fail('Could not logout');
		}
	});

	it('runs logout hook', async () => {
		const user = Object.assign(
			new HookTestClass(),
			await addResource(HookTestClass, {
				username: 'logout',
				password: hashSync('password123'),
				fname: 'logout',
				lnmae: 'hook',
				email: 'logout@example.com'
			}).catch((error) =>
				fail('Could not create user ' + JSON.stringify(error))
			)
		);

		// Create mock request/response
		const { request, response } = createMockRequest('DELETE');

		let result = '';
		request.hookShouldPass = true;
		request.hookCallback = (name) => (result = name);
		response.deleteResponder = () => {};

		request.payloadType = HookTestClass;
		request.repository = getRepository(HookTestClass);
		request.userType = HookTestClass;
		request.user = user;

		await logoutEndpoint(request, response);

		expect(result).toBe('logout');
	});

	it('calls response.error if logout hook fails', async () => {
		const user = Object.assign(
			new HookTestClass(),
			await addResource(HookTestClass, {
				username: 'logoutFail',
				password: hashSync('password123'),
				fname: 'logout',
				lnmae: 'hook',
				email: 'logoutFail@example.com'
			}).catch((error) =>
				fail('Could not create user ' + JSON.stringify(error))
			)
		);

		// Create mock request/response
		const { request, response } = createMockRequest('DELETE');

		let result = '';
		let hasError = '';
		request.hookShouldPass = false;
		request.hookCallback = (name) => (result = name);
		response.error = (error) => {
			hasError = error;
		};

		request.payloadType = HookTestClass;
		request.repository = getRepository(HookTestClass);
		request.userType = HookTestClass;
		request.user = user;

		await logoutEndpoint(request, response);

		expect(result).toBe('logout');
		expect(hasError).toBe('Could not complete hook');
	});
});
