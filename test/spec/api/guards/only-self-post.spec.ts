import { onlySelf } from '../../../../src/guards';
import { BaseUser } from '../../../../src/models';

import { createMockRequest } from '../../../../src/test-probe';

/**
 * onlySelf
 * pointyapi/guards
 */
describe('[Guards] onlySelf (Post)', async () => {
	it('passes authorized requests', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();
		request.method = 'POST';

		// Create user
		const user = new BaseUser();
		user.id = 1;

		request.user = user;
		request.body = user;

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
		request.method = 'POST';

		// Create user
		request.body = new BaseUser();
		request.body.id = 1;

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
		request.method = 'POST';

		// Create user
		request.user = new BaseUser();
		request.user.id = 1;

		request.body = new BaseUser();
		request.body.id = 2;

		// Test onlySelf()
		let result = false;
		response.forbiddenResponder = () => {
			result = true;
		};

		onlySelf(request, response, fail);

		expect(result).toBe(true);
	});
});
