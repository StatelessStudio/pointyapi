import { onlyMember } from '../../../../src/guards';
import { BaseUser } from '../../../../src/models';
import { UserRole } from '../../../../src/enums';

import { createMockRequest } from '../../../../src/test-probe';

/**
 * onlyMember
 * pointyapi/guards
 */
describe('[Guards] onlyMember', async () => {
	it('passes authorized requests', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create user
		request.user = new BaseUser();
		request.user.role = UserRole.Member;

		// Test onlyMember()
		let result = false;
		const next = () => {
			result = true;
		};

		onlyMember(request, response, next);

		expect(result).toBe(true);
	});

	it('refuses unauthenticated requests', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create user
		request.user = undefined;

		// Test onlyMember()
		let result = false;
		response.unauthorizedResponder = () => {
			result = true;
		};

		onlyMember(request, response, fail);

		expect(result).toBe(true);
	});

	it('refuses unauthorized requests', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create user
		request.user = new BaseUser();
		request.user.role = UserRole.Basic;

		// Test onlyMember()
		let result = false;
		response.forbiddenResponder = () => {
			result = true;
		};

		onlyMember(request, response, fail);

		expect(result).toBe(true);
	});
});
