import { onlyActive } from '../../../../src/guards';
import { BaseUser } from '../../../../src/models';
import { UserStatus } from '../../../../src/enums';

import { createMockRequest } from '../../../../src/test-probe';

/**
 * onlyActive
 * pointyapi/guards
 */
describe('[Guards] onlyActive', async () => {
	it('passes authorized requests', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create user
		request.user = new BaseUser();
		request.user.status = UserStatus.Active;

		// Test onlyActive()
		let result = false;
		const next = () => {
			result = true;
		};

		onlyActive(request, response, next);

		expect(result).toBe(true);
	});

	it('refuses unauthenticated requests', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create user
		request.user = undefined;

		// Test onlyActive()
		let result = false;
		response.unauthorizedResponder = () => {
			result = true;
		};

		onlyActive(request, response, fail);

		expect(result).toBe(true);
	});

	it('refuses unauthorized requests', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create user
		request.user = new BaseUser();
		request.user.status = UserStatus.Pending;

		// Test onlyActive()
		let result = false;
		response.unauthorizedResponder = () => {
			result = true;
		};

		onlyActive(request, response, fail);

		expect(result).toBe(true);
	});
});
