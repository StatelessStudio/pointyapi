import { getRepository } from 'typeorm';

import { createMockRequest } from '../../../../src/test-probe';
import { BaseUser } from '../../../../src/models';
import { patchFilter } from '../../../../src/filters';

/**
 * patchFilter()
 * pointyapi/guards
 */
describe('[Guards] patchFilter', async () => {
	beforeAll(async () => {
		// Create mock user
		this.user = new BaseUser();
		this.user.fname = 'tom';
		this.user.lname = 'doe';
		this.user.username = 'tomFilter3';
		this.user.email = 'tomFilter3@example.com';
		this.user.password = 'password123';

		await getRepository(BaseUser)
			.save(this.user)
			.catch((error) => fail(error));
	});

	it('allows valid request', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create request
		request.payload = this.user;
		request.user = this.user;
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
		request.payload = this.user;
		request.user = this.user;
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
