import { setModel } from '../../../../src';
import { BaseUser } from '../../../../src/models';
import { patchEndpoint } from '../../../../src/endpoints';
import { createMockRequest } from '../../../../src/test-probe';
import { HookTestClass } from '../../../examples/api/models/hook-test-class';
import { addResource } from '../../../../src/utils';
import { getRepository } from 'typeorm';

/**
 * patchEndpoint()
 * pointyapi/endpoints
 */
describe('[Endpoints] Patch', () => {
	beforeEach(() => {
		this.cwarn = console.warn;
		console.warn = () => {};
	});

	afterEach(() => {
		console.warn = this.cwarn;
	});

	it('can patch', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('PATCH');

		// Create user
		const user = new BaseUser();
		user.fname = 'Patch';
		user.lname = 'Endpoint';
		user.username = 'patchEndpoint';
		user.password = 'password123';
		user.email = 'patch@example.com';

		// Create repo
		await request.repository
			.save(user)
			.catch((error) => fail(JSON.stringify(error)));

		// Create request
		request.body = user;
		request.body.lname = '';
		request.identifier = 'id';
		request.params.id = user.id;

		// Set model
		if (!await setModel(request, response, BaseUser)) {
			fail('Could not set model');
		}

		// Test patchEndpoint()
		let result = false;

		response.patchResponder = () => {
			result = true;
		};

		await patchEndpoint(request, response).catch((error) =>
			fail(JSON.stringify(error))
		);

		expect(result).toBe(true);
		expect(request.payload.lname).toEqual(null);
	});

	it('calls validationResponder for a bad request', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('PATCH');

		// Create user
		const user = new BaseUser();
		user.fname = 'Patch';
		user.lname = 'Endpoint';
		user.username = 'patchEndpoint2';
		user.password = 'password123';
		user.email = 'testy';

		// Create repo
		await request.repository
			.save(user)
			.catch((error) => fail(JSON.stringify(error)));

		// Create request
		request.body = user;
		request.identifier = 'id';
		request.params.id = user.id;

		// Set model
		if (!await setModel(request, response, BaseUser)) {
			fail('Could not set model');
		}

		// Check patchEndpoint()
		let result = false;
		response.validationResponder = () => {
			result = true;
		};

		await patchEndpoint(request, response).catch((error) =>
			fail(JSON.stringify(error))
		);

		expect(result).toBe(true);
	});

	it('runs patch() hook', async () => {
		const user = Object.assign(
			new HookTestClass(),
			await addResource(HookTestClass, {
				username: 'patch',
				password: 'password123',
				fname: 'patch',
				lnmae: 'hook',
				email: 'patch@example.com'
			}).catch((error) =>
				fail('Could not create user ' + JSON.stringify(error))
			)
		);

		// Create mock request/response
		const { request, response } = createMockRequest('PATCH');

		let result = '';
		request.hookShouldPass = true;
		request.hookCallback = (name) => (result = name);

		request.user = user;
		request.payload = user;
		request.payloadType = HookTestClass;
		request.body = Object.assign(user, {
			fname: 'patched'
		});

		request.repository = getRepository(HookTestClass);
		response.patchResponder = () => {};

		await patchEndpoint(request, response);

		expect(result).toBe('patch');
	});

	it('returns false if patch() hook fails', async () => {
		const user = Object.assign(
			new HookTestClass(),
			await addResource(HookTestClass, {
				username: 'patchFail',
				password: 'password123',
				fname: 'patch',
				lnmae: 'hook',
				email: 'patchFail@example.com'
			}).catch((error) =>
				fail('Could not create user ' + JSON.stringify(error))
			)
		);

		// Create mock request/response
		const { request, response } = createMockRequest('PATCH');

		request.user = user;
		request.payload = user;
		request.repository = getRepository(HookTestClass);
		request.body = Object.assign(user, {
			fname: 'patched'
		});

		let result = '';
		let hasError = '';
		request.hookShouldPass = false;
		request.hookCallback = (name) => (result = name);
		response.error = (error) => {
			hasError = error;
		};
		response.patchResponder = () => {};

		await patchEndpoint(request, response);

		expect(result).toBe('patch');
		expect(hasError).toBe('Could not complete hook');
	});
});
