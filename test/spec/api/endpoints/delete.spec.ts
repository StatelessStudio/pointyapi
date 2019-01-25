import { mockRequest, mockResponse } from 'mock-req-res';

import { setModel } from '../../../../src/';
import { BaseUser } from '../../../../src/models';
import { deleteEndpoint } from '../../../../src/endpoints';
import { getRepository } from 'typeorm';

/**
 * Create mock request/response objects
 */
async function createMockup() {
	const request = mockRequest();
	request.repository = await getRepository(BaseUser);
	request.method = 'DELETE';
	request.baseUrl = '/api/v1/user';
	request.userType = BaseUser;
	request.joinMembers = [];

	const response = mockResponse();
	response.error = (error) => fail(JSON.stringify(error));
	response.goneResponder = (error) => fail('Gone: ' + JSON.stringify(error));
	response.deleteResponder = (msg) => fail('Deleted: ' + JSON.stringify(msg));

	return { request, response };
}

/**
 * deleteEndpoint()
 * pointyapi/endpoints
 */
describe('[Endpoints] Delete', () => {
	/**
	 * deleteEndpoint() deletes
	 */
	it('can delete', async () => {
		// Create mock request/response
		const { request, response } = await createMockup();

		// Create base user
		const user = new BaseUser();
		user.fname = 'Delete';
		user.lname = 'Endpoint';
		user.username = 'deleteEndpoint';
		user.password = 'password123';
		user.email = 'delete@example.com';

		// Get user repo
		const result = await getRepository(BaseUser)
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

	/**
	 * deleteResponder() calls response.goneResponder()
	 */
	it('calls response.goneResponder() if object not found', async () => {
		// Create mock request/response
		const { request, response } = await createMockup();

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
		if (await setModel(request, response, BaseUser)) {
			fail('Should not have been able to set model!');
		}

		// Expect goneResponder() to have been called
		expect(result).toBe(true);
	});
});
