import { setModel } from '../../../../src';
import { BaseUser } from '../../../../src/models';
import { postEndpoint } from '../../../../src/endpoints';
import { createMockRequest } from '../../../../src/test-probe';

/**
 * postEndpoint()
 * pointyapi/endpoints
 */
describe('[Endpoints] Post', () => {
	it('can post', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('POST');

		// Create users
		const user = new BaseUser();
		user.fname = 'Post';
		user.lname = 'Endpoint';
		user.username = 'postEndpoint';
		user.password = 'password123';
		user.email = 'post@example.com';

		request.body = user;

		// Set model
		if (!await setModel(request, response, BaseUser)) {
			fail('Could not set model');
		}

		// Test postResponder()
		let result = false;

		response.postResponder = () => {
			result = true;
		};

		await postEndpoint(request, response).catch((error) =>
			fail(JSON.stringify(error))
		);

		expect(result).toBe(true);
	});

	it('calls validationResponder for a bad request', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('POST');

		// Create user
		const user = new BaseUser();
		user.fname = 'Post';
		user.lname = 'Endpoint';
		user.username = 'postEndpoint2';
		user.password = 'password123';
		user.email = 'testy';

		request.body = user;

		// Set model
		if (!await setModel(request, response, BaseUser)) {
			fail('Could not set model');
		}

		// Test postEndpoint()
		let result = false;

		response.validationResponder = () => {
			result = true;
		};

		await postEndpoint(request, response).catch((error) =>
			fail(JSON.stringify(error))
		);

		expect(result).toBe(true);
	});
});
