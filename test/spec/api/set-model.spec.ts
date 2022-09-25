import 'jasmine';
import { createMockRequest } from '../../../src/test-probe';
import { setModel } from '../../../src';
import { ExampleUser } from '../../../src/models';
import { HookTestClass } from '../../examples/api/models/hook-test-class';
import { getRepository } from 'typeorm';
import { addResource } from '../../../src/utils';

/**
 * setModel()
 * pointyapi/
 */
describe('setModel', () => {
	let cwarn;
	let user;

	beforeEach(() => {
		cwarn = console.warn;
		console.warn = () => {};
	});

	afterEach(() => {
		console.warn = cwarn;
	});

	beforeAll(async () => {
		// Create user
		user = new ExampleUser();
		user.fname = 'Set';
		user.lname = 'Model';
		user.username = 'setmodel';
		user.password = 'model';
		user.email = 'setmodel@example.com';

		await getRepository(ExampleUser)
			.save(user);
	});

	it('sets the payload', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('');

		// Set model
		if (!await setModel(request, response, ExampleUser)) {
			fail('Could not set model');
		}

		// Expect payload to be a User
		expect(request.payload).toEqual(jasmine.any(ExampleUser));
	});

	it('sets the identifier', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('');

		// Set model
		if (
			!await setModel(request, response, ExampleUser, false, 'username')
		) {
			fail('Could not set model');
		}

		// Expect identifier to have been set
		expect(request.identifier).toEqual('username');
	});

	it('sets request.params to request.user on auth delete route', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('DELETE');
		request.user = new ExampleUser();
		request.user.id = 1;

		response.goneResponder = () => {};

		// Set model
		await setModel(request, response, ExampleUser, true);

		// Expect identifier to have been set
		expect(request.user).toEqual(request.params);
	});

	it('calls unauthorizedResponder on bad auth delete route', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('DELETE');

		let result = false;
		response.unauthorizedResponder = () => (result = true);

		// Set model
		if (await setModel(request, response, ExampleUser, true)) {
			fail('Should not set model');
		}

		// Expect unauthorizedResponder to have been called
		expect(result).toEqual(true);
	});

	it('can post array', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('POST');
		request.body = [
			{
				username: 'username1',
				password: 'test',
				fname: undefined
			},
			{
				username: 'username2',
				password: 'test',
				lname: undefined
			}
		];

		// Set model
		if (!await setModel(request, response, ExampleUser)) {
			fail('Could not set model');
		}
	});

	it('can post single', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('POST');
		request.body = {
			username: 'username1',
			password: 'test',
			fname: undefined
		};

		// Set model
		if (!await setModel(request, response, ExampleUser)) {
			fail('Could not set model');
		}
	});

	it('calls validation responder (post array)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('POST');
		request.body = [
			{
				username: 'username1',
				password: 'test',
				fname: undefined
			},
			{
				username: 'username2',
				password: 'test',
				lname: undefined,
				notInModel: true
			}
		];

		let result = false;
		response.validationResponder = () => (result = true);

		// Set model
		if (await setModel(request, response, ExampleUser)) {
			fail('Should not set model');
		}

		expect(result).toBe(true);
	});

	it('calls validation responder (post single)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('POST');
		request.body = {
			username: 'username2',
			password: 'test',
			lname: undefined,
			notInModel: true
		};

		let result = false;
		response.validationResponder = () => (result = true);

		// Set model
		if (await setModel(request, response, ExampleUser)) {
			fail('Should not set model');
		}

		expect(result).toBe(true);
	});

	it('can get', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('GET');
		request.query = {};

		// Set model
		if (!await setModel(request, response, ExampleUser)) {
			fail('Could not set model');
		}

		expect(request.payload).toEqual(jasmine.any(Array));
	});

	it('calls validation responder (get)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('GET');
		request.query = {
			username: 'username2',
			password: 'test',
			lname: undefined,
			notInModel: true
		};

		let result = false;
		response.validationResponder = () => (result = true);

		// Set model
		if (await setModel(request, response, ExampleUser)) {
			fail('Should not set model');
		}

		expect(result).toBe(true);
	});

	it('calls validation responder (patch)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('PATCH');
		request.body = {
			username: 'username2',
			password: 'test',
			lname: undefined,
			notInModel: true
		};

		let result = false;
		response.validationResponder = () => (result = true);

		// Set model
		if (await setModel(request, response, ExampleUser)) {
			fail('Should not set model');
		}

		expect(result).toBe(true);
	});

	it('calls gone responder (patch)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('PATCH');
		request.params = { id: 9999999 };

		let result = false;
		response.goneResponder = () => (result = true);

		// Set model
		if (await setModel(request, response, ExampleUser)) {
			fail('Should not set model');
		}

		expect(result).toBe(true);
	});

	it('calls gone responder (delete)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('DELETE');
		request.params = { id: 9999999 };

		let result = false;
		response.goneResponder = () => (result = true);

		// Set model
		if (await setModel(request, response, ExampleUser)) {
			fail('Should not set model');
		}

		expect(result).toBe(true);
	});

	it('runs beforePost() hook', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('POST');

		request.userType = HookTestClass;
		request.body = {
			username: 'beforePost',
			password: 'password123'
		};

		let result = '';
		request.hookShouldPass = true;
		request.hookCallback = (name) => (result = name);

		// Set model
		if (!await setModel(request, response, HookTestClass)) {
			fail('Could not set model');
		}

		expect(result).toBe('beforePost');
	});

	it('returns false if beforePost() fails', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('POST');

		request.userType = HookTestClass;
		request.body = {
			username: 'beforePost',
			password: 'password123'
		};

		let result = '';
		request.hookShouldPass = false;
		request.hookCallback = (name) => (result = name);
		response.error = () => {};

		// Set model
		if (await setModel(request, response, HookTestClass)) {
			fail('Should not set model');
		}

		expect(result).toBe('beforePost');
	});

	it('runs beforePatch() hook', async () => {
		const user = await addResource(HookTestClass, {
			username: 'beforePatch',
			password: 'password123',
			fname: 'before',
			lnmae: 'patch',
			email: 'beforePatch@example.com'
		});

		// Create mock request/response
		const { request, response } = createMockRequest('PATCH');

		request.userType = HookTestClass;
		request.body = Object.assign(new HookTestClass(), {
			username: 'patchUpdate',
			password: 'updated123'
		});
		request.params = { id: user['id'] };
		request.user = user;

		let result = '';
		request.hookShouldPass = true;
		request.hookCallback = (name) => (result = name);

		// Set model
		if (!await setModel(request, response, HookTestClass)) {
			fail('Could not set model');
		}

		expect(result).toBe('beforePatch');
	});

	it('returns false if beforePatch() fails', async () => {
		const user = await addResource(HookTestClass, {
			username: 'beforePatchFail',
			password: 'password123',
			fname: 'before',
			lnmae: 'patch',
			email: 'beforePatchFail@example.com'
		});

		// Create mock request/response
		const { request, response } = createMockRequest('PATCH');

		request.userType = HookTestClass;
		request.body = Object.assign(new HookTestClass(), {
			username: 'patchUpdate',
			password: 'updated123'
		});
		request.params = { id: user['id'] };
		request.user = user;

		let result = '';
		request.hookShouldPass = false;
		request.hookCallback = (name) => (result = name);
		response.error = () => {};

		// Set model
		if (await setModel(request, response, HookTestClass)) {
			fail('Should not set model');
		}

		expect(result).toBe('beforePatch');
	});

	it('runs beforeDelete() hook', async () => {
		const user = await addResource(HookTestClass, {
			username: 'beforeDelete',
			password: 'password123',
			fname: 'before',
			lnmae: 'delete',
			email: 'beforeDelete@example.com'
		});

		// Create mock request/response
		const { request, response } = createMockRequest('DELETE');

		request.userType = HookTestClass;
		request.params = { id: user['id'] };
		request.user = user;

		let result = '';
		request.hookShouldPass = true;
		request.hookCallback = (name) => (result = name);

		// Set model
		if (!await setModel(request, response, HookTestClass)) {
			fail('Could not set model');
		}

		expect(result).toBe('beforeDelete');
	});

	it('returns false if beforeDelete() fails', async () => {
		const user = await addResource(HookTestClass, {
			username: 'beforeDeleteFail',
			password: 'password123',
			fname: 'before',
			lnmae: 'delete',
			email: 'beforeDeleteFail@example.com'
		});

		// Create mock request/response
		const { request, response } = createMockRequest('DELETE');

		request.userType = HookTestClass;
		request.params = { id: user['id'] };
		request.user = user;

		let result = '';
		request.hookShouldPass = false;
		request.hookCallback = (name) => (result = name);
		response.error = () => {};

		// Set model
		if (await setModel(request, response, HookTestClass)) {
			fail('Should not set model');
		}

		expect(result).toBe('beforeDelete');
	});

	it('runs beforeLogin() hook', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('POST');

		request.userType = HookTestClass;
		request.body = {
			__user: 'testuser',
			password: 'password123'
		};

		let result = '';
		request.hookShouldPass = true;
		request.hookCallback = (name) => (result = name);

		// Set model
		if (!await setModel(request, response, HookTestClass, true)) {
			fail('Could not set model');
		}

		expect(result).toBe('beforeLogin');
	});

	it('returns false if beforeLogin() fails', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('POST');

		request.userType = HookTestClass;
		request.body = {
			__user: 'testuser',
			password: 'password123'
		};

		let result = '';
		request.hookShouldPass = false;
		request.hookCallback = (name) => (result = name);
		response.error = () => {};

		// Set model
		if (await setModel(request, response, HookTestClass, true)) {
			fail('Should not set model');
		}

		expect(result).toBe('beforeLogin');
	});

	it('runs beforeLogout() hook', async () => {
		const user = await addResource(HookTestClass, {
			username: 'beforeLogout',
			password: 'password123',
			fname: 'before',
			lnmae: 'logout',
			email: 'beforeLogout@example.com'
		});

		// Create mock request/response
		const { request, response } = createMockRequest('DELETE');

		request.params = { id: user['id'] };
		request.userType = HookTestClass;
		request.user = user;

		let result = '';
		request.hookShouldPass = true;
		request.hookCallback = (name) => (result = name);

		// Set model
		if (!await setModel(request, response, HookTestClass, true)) {
			fail('Could not set model');
		}

		expect(result).toBe('beforeLogout');
	});

	it('returns false if beforeLogout() fails', async () => {
		const user = await addResource(HookTestClass, {
			username: 'beforeLogoutFail',
			password: 'password123',
			fname: 'before',
			lnmae: 'logout',
			email: 'beforeLogoutFail@example.com'
		});

		// Create mock request/response
		const { request, response } = createMockRequest('DELETE');

		request.params = { id: user['id'] };
		request.userType = HookTestClass;
		request.user = user;

		let result = '';
		request.hookShouldPass = false;
		request.hookCallback = (name) => (result = name);
		response.error = () => {};

		// Set model
		if (await setModel(request, response, HookTestClass, true)) {
			fail('Should not set model');
		}

		expect(result).toBe('beforeLogout');
	});
});
