import { mockRequest, mockResponse } from 'mock-req-res';
import { getRepository } from 'typeorm';

import { setModel } from '../../../../src';
import { BaseUser } from '../../../../src/models';
import { postEndpoint } from '../../../../src/endpoints';

/**
 * Create mock request/response
 */
async function createMockup() {
	const request = mockRequest();
	request.repository = await getRepository(BaseUser);
	request.method = 'POST';
	request.baseUrl = '/api/v1/user';
	request.userType = BaseUser;
	request.joinMembers = [];

	const response = mockResponse();
	response.error = (error) => fail(JSON.stringify(error));
	response.validationResponder = (msg) =>
		fail('Validation: ' + JSON.stringify(msg));
	response.postResponder = (msg) => fail('Deleted: ' + JSON.stringify(msg));

	return { request, response };
}

/**
 * postEndpoint()
 * pointyapi/endpoints
 */
describe('[Endpoints] Post', () => {
	/**
	 * postEndpoint() can post
	 */
	it('can post', async () => {
		// Create mock request/response
		const { request, response } = await createMockup();

		// Create users
		const user = new BaseUser();
		user.fname = 'Post';
		user.lname = 'Endpoint';
		user.username = 'postEndpoint';
		user.password = 'password123';
		user.email = 'post@example.com';

		request.body = user;

		// Set model
		if (!await setModel(request, response, BaseUser)) {
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

	/**
	 * postEndpoint() calls validationResponder()
	 */
	it('calls validationResponder for a bad request', async () => {
		// Create mock request/response
		const { request, response } = await createMockup();

		// Create user
		const user = new BaseUser();
		user.fname = 'Post';
		user.lname = 'Endpoint';
		user.username = 'postEndpoint2';
		user.password = 'password123';
		user.email = 'testy';

		request.body = user;

		// Set model
		if (!await setModel(request, response, BaseUser)) {
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
});
