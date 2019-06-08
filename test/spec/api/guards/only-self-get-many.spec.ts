import { onlySelf } from '../../../../src/guards';
import { ExampleUser } from '../../../../src/models';

import { createMockRequest } from '../../../../src/test-probe';

/**
 * onlySelf
 * pointyapi/guards
 */
describe('[Guards] onlySelf (Get Many)', async () => {
	it('passes authorized requests', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create user
		const user = new ExampleUser();
		user.id = 1;

		request.user = user;
		request.payload = [ user ];

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
		const user = new ExampleUser();
		user.id = 1;

		request.payload = [ user ];

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

		const payload = new ExampleUser();
		payload.id = 2;

		request.payload = [ payload ];

		// Test onlySelf()
		let result = false;
		const next = () => {
			result = true;
		};

		onlySelf(request, response, next);

		expect(result).toBe(true);
		expect(request.payload.length).toEqual(0);
	});
});
