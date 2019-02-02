import { setModel } from '../../../../src';
import { BaseUser } from '../../../../src/models';
import { getEndpoint } from '../../../../src/endpoints';

import { createMockRequest } from '../../../../src/test-probe';

/**
 * getEndpoint()
 * pointyapi/endpoints
 */
describe('[Endpoints] Get', () => {
	it('returns the payload', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();
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
