import { mockRequest, mockResponse } from 'mock-req-res';
import { getRepository } from 'typeorm';

import { setModel } from '../../../../src';
import { BaseUser } from '../../../../src/models';
import { putEndpoint } from '../../../../src/endpoints';

/**
 * Create mock request/response
 */
async function createMockup() {
	const request = mockRequest();
	request.repository = await getRepository(BaseUser);
	request.method = 'PUT';
	request.baseUrl = '/api/v1/user';
	request.userType = BaseUser;
	request.joinMembers = [];

	const response = mockResponse();
	response.error = (error) => fail(JSON.stringify(error));
	response.validationResponder = (msg) =>
		fail('Validation: ' + JSON.stringify(msg));
	response.putResponder = (msg) => fail('Deleted: ' + JSON.stringify(msg));

	return { request, response };
}

/**
 * putEndpoint()
 * pointyapi/endpoints
 */
describe('[Endpoints] Put', () => {
	/**
	 * putEndpoint()
	 */
	it('can put', async () => {
		// Create mock request/response
		const { request, response } = await createMockup();

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

	/**
	 * putEndpoint() bad request
	 */
	it('calls validationResponder for a bad request', async () => {
		// Create mock request/response
		const { request, response } = await createMockup();

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
