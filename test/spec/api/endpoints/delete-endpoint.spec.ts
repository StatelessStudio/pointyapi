import { setModel } from '../../../../src';
import { BaseUser } from '../../../../src/models';
import { deleteEndpoint } from '../../../../src/endpoints';

import { createMockRequest } from '../../../../src/test-probe';
import { HookTestClass } from '../../../examples/api/models/hook-test-class';
import { addResource } from '../../../../src/utils';
import { getRepository } from 'typeorm';

/**
 * deleteEndpoint()
 * pointyapi/endpoints
 */
describe('[Endpoints] Delete', () => {
	it('can delete', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('DELETE');

		// Create base user
		const user = new BaseUser();
		user.fname = 'Delete';
		user.lname = 'Endpoint';
		user.username = 'deleteEndpoint';
		user.password = 'password123';
		user.email = 'delete@example.com';

		// Get user repo
		const result = await request.repository
			.save(user)
			.catch((error) => fail(JSON.stringify(error)));

		// Setup request
		request.identifier = 'id';
		request.params = result;

		// Set model
		if (!await setModel(request, response, BaseUser)) {
			fail('Could not set model');
		}

		// Test delete responder
		response.deleteResponder = () => {};
		await deleteEndpoint(request, response).catch((error) =>
			fail(JSON.stringify(error))
		);
	});

	it('calls response.goneResponder() if object not found', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('DELETE');

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
		await deleteEndpoint(request, response);

		// Expect goneResponder() to have been called
		expect(result).toBe(true);
	});

	it('runs delete() hook', async () => {
		const user = Object.assign(
			new HookTestClass(),
			await addResource(HookTestClass, {
				username: 'delete',
				password: 'password123',
				fname: 'delete',
				lnmae: 'hook',
				email: 'delete@example.com',
				token: 'testtoken'
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
		response.deleteResponder = () => {};

		await deleteEndpoint(request, response);

		expect(result).toBe('delete');
	});

	it('calls error if delete hook fails', async () => {
		const user = Object.assign(
			new HookTestClass(),
			await addResource(HookTestClass, {
				username: 'deleteFail',
				password: 'password123',
				fname: 'delete',
				lnmae: 'hook',
				email: 'deleteFail@example.com',
				token: 'testtoken'
			}).catch((error) =>
				fail('Could not create user ' + JSON.stringify(error))
			)
		);

		// Create mock request/response
		const { request, response } = createMockRequest('DELETE');

		request.user = user;
		request.payload = user;
		request.repository = getRepository(HookTestClass);
		response.deleteResponder = () => {};

		let result = '';
		let hasError = '';
		request.hookShouldPass = false;
		request.hookCallback = (name) => (result = name);
		response.error = (error) => {
			hasError = error;
		};

		await deleteEndpoint(request, response);

		expect(result).toBe('delete');
		expect(hasError).toBe('Could not complete hook');
	});
});
