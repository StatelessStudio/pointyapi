import { onlySelf } from '../../../../src/guards';
import { BaseUser } from '../../../../src/models';

import { createMockRequest } from '../../../../src/test-probe';

/**
 * onlySelf
 * pointyapi/guards
 */
describe('[Guards] onlySelf (Put)', async () => {
	it('passes authorized requests', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('PUT');

		// Create user
		const user = new BaseUser();
		user.id = 1;

		request.user = user;
		request.payload = user;

		request.params = { id: 1 };

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
		const { request, response } = createMockRequest('PUT');

		// Create user
		request.payload = new BaseUser();
		request.payload.id = 1;

		request.params = { id: 1 };

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
		const { request, response } = createMockRequest('PUT');

		// Create user
		request.user = new BaseUser();
		request.user.id = 1;

		request.payload = new BaseUser();
		request.payload.id = 2;

		request.params = { id: 2 };

		// Test onlySelf()
		let result = false;
		response.unauthorizedResponder = () => {
			result = true;
		};

		onlySelf(request, response, fail);

		expect(result).toBe(true);
	});
});
