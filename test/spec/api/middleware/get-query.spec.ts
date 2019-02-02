import { getRepository } from 'typeorm';

import { setModel } from '../../../../src';
import { BaseUser } from '../../../../src/models';
import { getQuery } from '../../../../src/middleware';
import { createMockRequest } from '../../../../src/test-probe';

/**
 * getQuery()
 * pointyapi/middleware
 */
describe('[Middleware] GetQuery', () => {
	it('can search', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create request
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

		// Save users
		await getRepository(BaseUser)
			.save([ user1, user2 ])
			.catch((error) => fail(JSON.stringify(error)));

		// Set model
		if (!await setModel(request, response, BaseUser)) {
			fail('Could not set model');
		}

		// Test getQuery()
		await getQuery(request, response)
			.then((result) => {
				request.payload = result;
			})
			.catch((error) => fail(JSON.stringify(error)));

		expect(request.payload).toEqual(jasmine.any(Array));
		expect(request.payload.length).toBeGreaterThanOrEqual(2);
	});
});
