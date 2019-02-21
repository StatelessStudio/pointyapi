import { setModel } from '../../../../src';
import { BaseUser } from '../../../../src/models';
import { patchEndpoint } from '../../../../src/endpoints';
import { createMockRequest } from '../../../../src/test-probe';

/**
 * patchEndpoint()
 * pointyapi/endpoints
 */
describe('[Endpoints] Patch', () => {
	it('can patch', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('PATCH');

		// Create user
		const user = new BaseUser();
		user.fname = 'Patch';
		user.lname = 'Endpoint';
		user.username = 'patchEndpoint';
		user.password = 'password123';
		user.email = 'patch@example.com';

		// Create repo
		await request.repository
			.save(user)
			.catch((error) => fail(JSON.stringify(error)));

		// Create request
		request.body = user;
		request.body.lname = '';
		request.identifier = 'id';
		request.params.id = user.id;

		// Set model
		if (!await setModel(request, response, BaseUser)) {
			fail('Could not set model');
		}

		// Test patchEndpoint()
		let result = false;

		response.patchResponder = () => {
			result = true;
		};

		await patchEndpoint(request, response).catch((error) =>
			fail(JSON.stringify(error))
		);

		expect(result).toBe(true);
		expect(request.payload.lname).toEqual(null);
	});

	it('calls validationResponder for a bad request', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('PATCH');

		// Create user
		const user = new BaseUser();
		user.fname = 'Patch';
		user.lname = 'Endpoint';
		user.username = 'patchEndpoint2';
		user.password = 'password123';
		user.email = 'testy';

		// Create repo
		await request.repository
			.save(user)
			.catch((error) => fail(JSON.stringify(error)));

		// Create request
		request.body = user;
		request.identifier = 'id';
		request.params.id = user.id;

		// Set model
		if (!await setModel(request, response, BaseUser)) {
			fail('Could not set model');
		}

		// Check patchEndpoint()
		let result = false;
		response.validationResponder = () => {
			result = true;
		};

		await patchEndpoint(request, response).catch((error) =>
			fail(JSON.stringify(error))
		);

		expect(result).toBe(true);
	});
});
