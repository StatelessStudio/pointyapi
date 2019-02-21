import { createMockRequest } from '../../../src/test-probe';
import { setModel } from '../../../src';
import { BaseUser } from '../../../src/models';
import { getRepository } from 'typeorm';

/**
 * setModel()
 * pointyapi/
 */
describe('setModel', () => {
	beforeAll(async () => {
		// Create user
		this.user = new BaseUser();
		this.user.fname = 'Set';
		this.user.lname = 'Model';
		this.user.username = 'setmodel';
		this.user.password = 'model';
		this.user.email = 'setmodel@example.com';

		await getRepository(BaseUser)
			.save(this.user)
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('sets the payload', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('');

		// Set model
		if (!await setModel(request, response, BaseUser)) {
			fail('Could not set model');
		}

		// Expect payload to be a User
		expect(request.payload).toEqual(jasmine.any(BaseUser));
	});

	it('sets the identifier', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('');

		// Set model
		if (!await setModel(request, response, BaseUser, false, 'username')) {
			fail('Could not set model');
		}

		// Expect identifier to have been set
		expect(request.identifier).toEqual('username');
	});

	it('sets request.params to request.user on auth delete route', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('DELETE');
		request.user = new BaseUser();
		request.user.id = 1;

		response.goneResponder = () => {};

		// Set model
		await setModel(request, response, BaseUser, true);

		// Expect identifier to have been set
		expect(request.user).toEqual(request.params);
	});

	it('calls unauthorizedResponder on bad auth delete route', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('DELETE');

		let result = false;
		response.unauthorizedResponder = () => (result = true);

		// Set model
		if (await setModel(request, response, BaseUser, true)) {
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
		if (!await setModel(request, response, BaseUser)) {
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
		if (!await setModel(request, response, BaseUser)) {
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
		if (await setModel(request, response, BaseUser)) {
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
		if (await setModel(request, response, BaseUser)) {
			fail('Should not set model');
		}

		expect(result).toBe(true);
	});

	it('can get', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('GET');
		request.query = {};

		// Set model
		if (!await setModel(request, response, BaseUser)) {
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
		if (await setModel(request, response, BaseUser)) {
			fail('Should not set model');
		}

		expect(result).toBe(true);
	});

	it('calls validation responder (put)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('PUT');
		request.body = {
			username: 'username2',
			password: 'test',
			lname: undefined,
			notInModel: true
		};

		let result = false;
		response.validationResponder = () => (result = true);

		// Set model
		if (await setModel(request, response, BaseUser)) {
			fail('Should not set model');
		}

		expect(result).toBe(true);
	});

	it('calls gone responder (put)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('PUT');
		request.params = { id: 9999999 };

		let result = false;
		response.goneResponder = () => (result = true);

		// Set model
		if (await setModel(request, response, BaseUser)) {
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
		if (await setModel(request, response, BaseUser)) {
			fail('Should not set model');
		}

		expect(result).toBe(true);
	});
});
