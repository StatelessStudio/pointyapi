import 'jasmine';
import { onlySelf } from '../../../../src/guards';
import { ExampleUser } from '../../../../src/models';

import { createMockRequest } from '../../../../src/test-probe';
import { UserRole } from '../../../../src/enums';

/**
 * onlySelf
 * pointyapi/guards
 */
describe('[Guards] onlySelf (Get One)', async () => {
	it('passes authorized requests', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create user
		const user = new ExampleUser();
		user.id = 1;

		request.user = user;
		request.payload = user;

		request.query = { id: 1 };

		// Test onlySelf()
		let result = false;
		const next = () => {
			result = true;
		};

		onlySelf(request, response, next);

		expect(result).toBe(true);
	});

	it('refuses unauthenticated requests', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create user
		request.payload = new ExampleUser();
		request.payload.id = 1;

		request.query = { id: 1 };

		// Test onlySelf()
		let result = false;
		response.unauthorizedResponder = () => {
			result = true;
		};

		onlySelf(request, response, fail);

		expect(result).toBe(true);
	});

	it('refuses unauthorized requests', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create user
		request.user = new ExampleUser();
		request.user.id = 1;

		request.payload = new ExampleUser();
		request.payload.id = 2;

		request.query = { id: 2 };

		// Test onlySelf()
		let result = false;
		response.forbiddenResponder = () => {
			result = true;
		};

		onlySelf(request, response, fail);

		expect(result).toBe(true);
	});

	it('bypasses admin requests', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create user
		request.user = new ExampleUser();
		request.user.id = 1;
		request.user.role = UserRole.Admin;

		request.payload = new ExampleUser();
		request.payload.id = 2;

		request.query = { id: 2 };

		// Test onlySelf()
		let result = false;
		const next = () => {
			result = true;
		};

		onlySelf(request, response, next);

		expect(result).toBe(true);
	});
});
