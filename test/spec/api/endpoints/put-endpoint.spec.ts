import { setModel } from '../../../../src';
import { BaseUser } from '../../../../src/models';
import { putEndpoint } from '../../../../src/endpoints';
import { createMockRequest } from '../../../../src/test-probe';

/**
 * putEndpoint()
 * pointyapi/endpoints
 */
describe('[Endpoints] Put', () => {
	it('can put', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('PUT');

		// Create user
		const user = new BaseUser();
		user.fname = 'Put';
		user.lname = 'Endpoint';
		user.username = 'putEndpoint';
		user.password = 'password123';
		user.email = 'put@example.com';

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

		// Test putEndpoint()
		let result = false;

		response.putResponder = () => {
			result = true;
		};

		await putEndpoint(request, response).catch((error) =>
			fail(JSON.stringify(error))
		);

		expect(result).toBe(true);
	});

	it('calls validationResponder for a bad request', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest('PUT');

		// Create user
		const user = new BaseUser();
		user.fname = 'Put';
		user.lname = 'Endpoint';
		user.username = 'putEndpoint2';
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

		// Check putEndpoint()
		let result = false;
		response.validationResponder = () => {
			result = true;
		};

		await putEndpoint(request, response).catch((error) =>
			fail(JSON.stringify(error))
		);

		expect(result).toBe(true);
	});
});