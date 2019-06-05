import { onlyAdmin } from '../../../../src/guards';
import { BaseUser } from '../../../../src/models';
import { UserRole } from '../../../../src/enums';

import { createMockRequest } from '../../../../src/test-probe';

/**
 * onlyAdmin
 * pointyapi/guards
 */
describe('[Guards] onlyAdmin', async () => {
	it('passes authorized requests', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create user
		request.user = new BaseUser();
		request.user.role = UserRole.Admin;

		// Test onlyAdmin()
		let result = false;
		const next = () => {
			result = true;
		};

		onlyAdmin(request, response, next);

		expect(result).toBe(true);
	});

	it('refuses unauthenticated requests', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create user
		request.user = undefined;

		// Test onlyAdmin()
		let result = false;
		response.forbiddenResponder = () => {
			result = true;
		};

		onlyAdmin(request, response, fail);

		expect(result).toBe(true);
	});

	it('refuses unauthorized requests', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create user
		request.user = new BaseUser();
		request.user.role = UserRole.Basic;

		// Test onlyAdmin()
		let result = false;
		response.forbiddenResponder = () => {
			result = true;
		};

		onlyAdmin(request, response, fail);

		expect(result).toBe(true);
	});
});
