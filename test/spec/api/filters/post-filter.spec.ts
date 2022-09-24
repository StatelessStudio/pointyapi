import 'jasmine';
import { getRepository } from 'typeorm';

import { createMockRequest } from '../../../../src/test-probe';
import { ExampleUser } from '../../../../src/models';
import { postFilter } from '../../../../src/filters';

/**
 * postFilter()
 * pointyapi/guards
 */
describe('[Guards] postFilter', async () => {
	let user;

	beforeAll(async () => {
		// Create mock user
		user = new ExampleUser();
		user.fname = 'tom';
		user.lname = 'doe';
		user.username = 'tomFilter2';
		user.email = 'tomFilter2@example.com';
		user.password = 'password123';

		user = await getRepository(ExampleUser)
			.save(user)
			.catch((error) => fail(error));
	});

	it('allows valid request', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create request
		request.payload = user;
		request.user = user;
		request.body = {
			fname: 'tom'
		};

		// Filter
		let result = false;
		const next = () => {
			result = true;
		};

		postFilter(request, response, next);

		expect(result).toBe(true);
	});

	it('refuses invalid request', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create request
		request.payload = user;
		request.body = {
			id: 12
		};

		// Filter
		let result = false;
		response.forbiddenResponder = () => {
			result = true;
		};

		postFilter(request, response, fail);

		expect(result).toBe(true);
	});
});
