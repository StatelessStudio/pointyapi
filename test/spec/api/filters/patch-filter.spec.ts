import 'jasmine';
import { getRepository } from 'typeorm';

import { createMockRequest } from '../../../../src/test-probe';
import { ExampleUser } from '../../../../src/models';
import { patchFilter } from '../../../../src/filters';

/**
 * patchFilter()
 * pointyapi/guards
 */
describe('[Guards] patchFilter', async () => {
	let user;

	beforeAll(async () => {
		// Create mock user
		user = new ExampleUser();
		user.fname = 'tom';
		user.lname = 'doe';
		user.username = 'tomFilter3';
		user.email = 'tomFilter3@example.com';
		user.password = 'password123';

		await getRepository(ExampleUser)
			.save(user);
	});

	it('allows valid request', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create request
		request.payload = user;
		request.user = user;
		request.body = {
			fname: 'update'
		};

		// Filter
		let result = false;
		const next = () => {
			result = true;
		};

		patchFilter(request, response, next);

		expect(result).toBe(true);
	});

	it('refuses invalid request', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create request
		request.payload = user;
		request.user = user;
		request.body = {
			id: 12
		};

		// Filter
		let result = false;
		response.forbiddenResponder = () => {
			result = true;
		};

		patchFilter(request, response, fail);

		expect(result).toBe(true);
	});
});
