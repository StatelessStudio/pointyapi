import { mockRequest, mockResponse } from 'mock-req-res';
import { getRepository } from 'typeorm';

import { setModel } from '../../../../src';
import { BaseUser } from '../../../../src/models';
import { getEndpoint } from '../../../../src/endpoints';

/**
 * Create mock request/response
 */
async function createMockup() {
	const request = mockRequest();
	request.repository = await getRepository(BaseUser);
	request.method = 'GET';
	request.baseUrl = '/api/v1/user';
	request.userType = BaseUser;
	request.joinMembers = [];

	const response = mockResponse();
	response.error = (error) => fail(JSON.stringify(error));
	response.getResponder = (error) => fail('Got: ' + JSON.stringify(error));

	return { request, response };
}

/**
 * getEndpoint()
 * pointyapi/getEndpoint()
 */
describe('[Endpoints] Get', () => {
	/**
	 * getEndpoint() returns the payload
	 */
	it('returns the payload', async () => {
		// Create mock request/response
		const { request, response } = await createMockup();
		request.query.__search = 'Get';

		// Create users
		const user1 = new BaseUser();
		user1.fname = 'Get';
		user1.lname = 'Endpoint';
		user1.username = 'getEndpoint1';
		user1.password = 'password123';
		user1.email = 'get1@example.com';

		const user2 = new BaseUser();
		user2.fname = 'Get';
		user2.lname = 'Endpoint';
		user2.username = 'getEndpoint2';
		user2.password = 'password123';
		user2.email = 'get2@example.com';

		// Set model
		if (!await setModel(request, response, BaseUser)) {
			fail('Could not set model');
		}

		// Set payload
		request.payload = [ user1, user2 ];

		// Check for getResponder()
		response.getResponder = () => {
			expect(request.payload).toEqual(jasmine.any(Array));
			expect(request.payload.length).toBeGreaterThanOrEqual(2);
		};

		// Run request
		await getEndpoint(request, response).catch((error) =>
			fail(JSON.stringify(error))
		);
	});
});
