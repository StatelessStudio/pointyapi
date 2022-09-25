import 'jasmine';
import { setModel } from '../../../../src';
import { ExampleUser } from '../../../../src/models';
import { getEndpoint } from '../../../../src/endpoints';

import { createMockRequest } from '../../../../src/test-probe';
import { HookTestClass } from '../../../examples/api/models/hook-test-class';
import { addResource } from '../../../../src/utils';
import { getRepository } from 'typeorm';

/**
 * getEndpoint()
 * pointyapi/endpoints
 */
describe('[Endpoints] Get', () => {
	let user1;
	let user2;

	beforeAll(() => {
		// Create users
		user1 = new ExampleUser();
		user1.fname = 'Get';
		user1.lname = 'Endpoint';
		user1.username = 'getEndpoint1';
		user1.password = 'password123';
		user1.email = 'get1@example.com';

		user2 = new ExampleUser();
		user2.fname = 'Get';
		user2.lname = 'Endpoint';
		user2.username = 'getEndpoint2';
		user2.password = 'password123';
		user2.email = 'get2@example.com';
	});

	it('returns the payload', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();
		request.query.search = 'Get';

		// Set model
		if (!await setModel(request, response, ExampleUser)) {
			fail('Could not set model');
		}

		// Set payload
		request.payload = [ user1, user2 ];

		// Check for getResponder()
		response.getResponder = (result) => {
			expect(result).toEqual(jasmine.any(Array));
			expect(result.length).toBeGreaterThanOrEqual(2);
		};

		// Run request
		await getEndpoint(request, response);
	});

	it('can return a count request', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();
		request.query.search = 'Get';
		request.query.count = true;

		// Set model
		if (!await setModel(request, response, ExampleUser)) {
			fail('Could not set model');
		}

		// Set payload
		request.payload = [ user1, user2 ];

		// Check for getResponder()
		response.getResponder = (result) => {
			expect(result.count).toBe(2);
		};

		// Run request
		await getEndpoint(request, response);
	});

	it('can return a single resource request', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();
		request.query.search = 'Get';

		// Set model
		if (!await setModel(request, response, ExampleUser)) {
			fail('Could not set model');
		}

		// Set payload
		request.payload = user1;

		// Check for getResponder()
		response.getResponder = (result) => {
			expect(result).toEqual(jasmine.any(ExampleUser));
		};

		// Run request
		await getEndpoint(request, response);
	});

	it('calls response.goneResponder() if object not found', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Setup request
		request.identifier = 'id';
		request.params = {
			id: 12345
		};

		// Setup response object
		let result = false;
		response.goneResponder = () => {
			result = true;
		};

		// Set model
		await getEndpoint(request, response);

		// Expect goneResponder() to have been called
		expect(result).toBe(true);
	});

	it('runs get() hook', async () => {
		const user = Object.assign(
			new HookTestClass(),
			await addResource(HookTestClass, {
				username: 'get',
				password: 'password123',
				fname: 'get',
				lnmae: 'hook',
				email: 'get@example.com'
			}).catch((error) =>
				fail('Could not create user ' + JSON.stringify(error))
			)
		);

		// Create mock request/response
		const { request, response } = createMockRequest('DELETE');

		let result = '';
		request.hookShouldPass = true;
		request.hookCallback = (name) => (result = name);

		request.user = user;
		request.payload = user;
		request.payloadType = HookTestClass;
		request.repository = getRepository(HookTestClass);
		response.getResponder = () => {};

		await getEndpoint(request, response);

		expect(result).toBe('get');
	});

	it('returns false if get() hook fails', async () => {
		const user = Object.assign(
			new HookTestClass(),
			await addResource(HookTestClass, {
				username: 'getFail',
				password: 'password123',
				fname: 'get',
				lnmae: 'hook',
				email: 'getFail@example.com'
			}).catch((error) =>
				fail('Could not create user ' + JSON.stringify(error))
			)
		);

		// Create mock request/response
		const { request, response } = createMockRequest('DELETE');

		request.user = user;
		request.payload = user;
		request.repository = getRepository(HookTestClass);
		response.getResponder = () => {};

		let result = '';
		let hasError = '';
		request.hookShouldPass = false;
		request.hookCallback = (name) => (result = name);
		response.error = (error) => {
			hasError = error;
		};

		await getEndpoint(request, response);

		expect(result).toBe('get');
		expect(hasError).toBe('Could not complete hook');
	});
});
