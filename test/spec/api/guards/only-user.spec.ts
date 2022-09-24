import 'jasmine';
import { onlyUser } from '../../../../src/guards';
import { ExampleUser } from '../../../../src/models';
import { UserRole } from '../../../../src/enums';

import { createMockRequest } from '../../../../src/test-probe';

/**
 * onlyUser
 * pointyapi/guards
 */
describe('[Guards] onlyUser', async () => {
	it('passes authorized requests', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create user
		request.user = new ExampleUser();

		// Test onlyUser()
		let result = false;
		const next = () => {
			result = true;
		};

		onlyUser(request, response, next);

		expect(result).toBe(true);
	});

	it('refuses unauthenticated requests', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create user
		request.user = undefined;

		// Test onlyUser()
		let result = false;
		response.unauthorizedResponder = () => {
			result = true;
		};

		onlyUser(request, response, fail);

		expect(result).toBe(true);
	});
});
