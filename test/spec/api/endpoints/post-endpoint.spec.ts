import 'jasmine';
import { setModel } from '../../../../src';
import { ExampleUser } from '../../../../src/models';
import { postEndpoint } from '../../../../src/endpoints';
import { createMockRequest } from '../../../../src/test-probe';
import { HookTestClass } from '../../../examples/api/models/hook-test-class';
import { addResource } from '../../../../src/utils';
import { getRepository } from 'typeorm';

/**
 * postEndpoint()
 * pointyapi/endpoints
 */
describe('[Endpoints] Post', () => {
	let cwarn;

	beforeEach(() => {
		cwarn = console.warn;
		console.warn = () => {};
	});

	afterEach(() => {
		console.warn = cwarn;
	});

	it('can post (single)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('POST');

		// Create users
		const user = new ExampleUser();
		user.fname = 'Post';
		user.lname = 'Endpoint';
		user.username = 'postEndpoint';
		user.password = 'password123';
		user.email = 'post@example.com';

		request.body = user;

		// Set model
		if (!await setModel(request, response, ExampleUser)) {
			fail('Could not set model');
		}

		// Test postResponder()
		let result = false;

		response.postResponder = () => {
			result = true;
		};

		await postEndpoint(request, response).catch((error) =>
			fail(JSON.stringify(error))
		);

		expect(result).toBe(true);
	});

	it('calls validationResponder on bad request (single)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('POST');

		// Create user
		const user = new ExampleUser();
		user.fname = 'Post';
		user.lname = 'Endpoint';
		user.username = 'postEndpoint2';
		user.password = 'password123';
		user.email = 'testy';

		request.body = user;

		// Set model
		if (!await setModel(request, response, ExampleUser)) {
			fail('Could not set model');
		}

		// Test postEndpoint()
		let result = false;

		response.validationResponder = () => {
			result = true;
		};

		await postEndpoint(request, response).catch((error) =>
			fail(JSON.stringify(error))
		);

		expect(result).toBe(true);
	});

	it('can post (array)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('POST');

		// Create users
		const user1 = new ExampleUser();
		user1.fname = 'Post';
		user1.lname = 'Endpoint';
		user1.username = 'postEndpoint3';
		user1.password = 'password123';
		user1.email = 'post3@example.com';

		const user2 = new ExampleUser();
		user2.fname = 'Post';
		user2.lname = 'Endpoint';
		user2.username = 'postEndpoint4';
		user2.password = 'password123';
		user2.email = 'post4@example.com';

		request.body = [ user1, user2 ];

		// Set model
		if (!await setModel(request, response, ExampleUser)) {
			fail('Could not set model');
		}

		// Test postResponder()
		let result = false;

		response.postResponder = () => {
			result = true;
		};

		await postEndpoint(request, response).catch((error) =>
			fail(JSON.stringify(error))
		);

		expect(result).toBe(true);
	});

	it('calls validationResponder on bad request (array)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('POST');

		// Create user
		const user1 = new ExampleUser();
		user1.fname = 'Post';
		user1.lname = 'Endpoint';
		user1.username = 'postEndpoint5';
		user1.password = 'password123';
		user1.email = 'testy';

		const user2 = new ExampleUser();
		user2.fname = 'Post';
		user2.lname = 'Endpoint';
		user2.username = 'postEndpoint6';
		user2.password = 'password123';
		user2.email = 'testy';

		request.body = [ user1, user2 ];

		// Set model
		if (!await setModel(request, response, ExampleUser)) {
			fail('Could not set model');
		}

		// Test postEndpoint()
		let result = false;

		response.validationResponder = () => {
			result = true;
		};

		await postEndpoint(request, response).catch((error) =>
			fail(JSON.stringify(error))
		);

		expect(result).toBe(true);
	});

	it('runs post() hook', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('POST');

		let result = '';
		request.hookShouldPass = true;
		request.hookCallback = (name) => (result = name);

		request.payloadType = HookTestClass;
		request.body = Object.assign(new HookTestClass(), {
			username: 'post',
			password: 'password123',
			fname: 'post',
			lnmae: 'hook',
			email: 'post@example.com'
		});

		request.repository = getRepository(HookTestClass);
		response.postResponder = () => {};

		await postEndpoint(request, response);

		expect(result).toBe('post');
	});

	it('returns false if post() hook fails', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('POST');

		request.payloadType = HookTestClass;
		request.body = Object.assign(new HookTestClass(), {
			username: 'post',
			password: 'password123',
			fname: 'post',
			lnmae: 'hook',
			email: 'post@example.com'
		});

		let result = '';
		let hasError = '';
		request.hookShouldPass = false;
		request.repository = getRepository(HookTestClass);
		request.hookCallback = (name) => (result = name);
		response.error = (error) => {
			hasError = error;
		};
		response.postResponder = () => {};

		await postEndpoint(request, response);

		expect(result).toBe('post');
		expect(hasError).toBe('Could not complete hook');
	});
});
