import { setModel } from '../../../../src';
import { BaseUser } from '../../../../src/models';
import { deleteEndpoint } from '../../../../src/endpoints';

import { createMockRequest } from '../../../../src/test-probe';

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
});
