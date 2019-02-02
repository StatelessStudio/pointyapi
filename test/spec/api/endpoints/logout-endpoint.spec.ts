import { getRepository } from 'typeorm';
import { hashSync } from 'bcryptjs';

import { BaseUser } from '../../../../src/models';
import { logoutEndpoint, loginEndpoint } from '../../../../src/endpoints';
import { createMockRequest } from '../../../../src/test-probe';

/**
 * logoutEndpoint()
 * pointyapi/endpoints
 */
describe('[Endpoints] Logout', async () => {
	beforeAll(async () => {
		// Create user
		const user = new BaseUser();
		user.fname = 'Logout';
		user.lname = 'Test';
		user.username = 'logouttest';
		user.password = hashSync('password123', 12);
		user.email = 'logouttest@example.com';

		await getRepository(BaseUser)
			.save(user)
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can logout', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		request.body = {
			__user: 'logouttest',
			password: 'password123'
		};

		// Login
		await loginEndpoint(request, response);

		// Run logout endpoint
		let match = false;
		response.deleteResponder = (result) => {
			match = result;
		};

		await logoutEndpoint(request, response);

		if (match) {
			expect(match).toEqual(jasmine.any(BaseUser));
			expect(match['token']).toEqual('');
			expect(request.user).toBe(undefined);
		}
		else {
			fail('Could not logout');
		}
	});

	it('calls unauthorizedResponder() if not logged in', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Run logout endpoint
		let match = false;
		response.unauthorizedResponder = () => {
			match = true;
		};

		await logoutEndpoint(request, response);

		if (match) {
			expect(match).toBe(true);
		}
		else {
			fail('Could not logout');
		}
	});
});
