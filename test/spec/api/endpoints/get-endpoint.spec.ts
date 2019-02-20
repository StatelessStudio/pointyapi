import { setModel } from '../../../../src';
import { BaseUser } from '../../../../src/models';
import { getEndpoint } from '../../../../src/endpoints';

import { createMockRequest } from '../../../../src/test-probe';

/**
 * getEndpoint()
 * pointyapi/endpoints
 */
describe('[Endpoints] Get', () => {
	beforeAll(() => {
		// Create users
		this.user1 = new BaseUser();
		this.user1.fname = 'Get';
		this.user1.lname = 'Endpoint';
		this.user1.username = 'getEndpoint1';
		this.user1.password = 'password123';
		this.user1.email = 'get1@example.com';

		this.user2 = new BaseUser();
		this.user2.fname = 'Get';
		this.user2.lname = 'Endpoint';
		this.user2.username = 'getEndpoint2';
		this.user2.password = 'password123';
		this.user2.email = 'get2@example.com';
	});

	it('returns the payload', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();
		request.query.search = 'Get';

		// Set model
		if (!await setModel(request, response, BaseUser)) {
			fail('Could not set model');
		}

		// Set payload
		request.payload = [ this.user1, this.user2 ];

		// Check for getResponder()
		response.getResponder = (result) => {
			expect(result).toEqual(jasmine.any(Array));
			expect(result.length).toBeGreaterThanOrEqual(2);
		};

		// Run request
		await getEndpoint(request, response).catch((error) =>
			fail(JSON.stringify(error))
		);
	});

	it('can return a count request', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();
		request.query.search = 'Get';
		request.query.count = true;

		// Set model
		if (!await setModel(request, response, BaseUser)) {
			fail('Could not set model');
		}

		// Set payload
		request.payload = [ this.user1, this.user2 ];

		// Check for getResponder()
		response.getResponder = (result) => {
			expect(result.count).toBe(2);
		};

		// Run request
		await getEndpoint(request, response).catch((error) =>
			fail(JSON.stringify(error))
		);
	});

	it('can return a single resource request', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();
		request.query.search = 'Get';

		// Set model
		if (!await setModel(request, response, BaseUser)) {
			fail('Could not set model');
		}

		// Set payload
		request.payload = this.user1;

		// Check for getResponder()
		response.getResponder = (result) => {
			expect(result).toEqual(jasmine.any(BaseUser));
		};

		// Run request
		await getEndpoint(request, response).catch((error) =>
			fail(JSON.stringify(error))
		);
	});

	it('calls response.goneResponder() if object not found', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Setup request
		request.identifier = 'id';
		request.params = {
			id: 12345
		};

		// Setup response object
		let result = false;
		response.goneResponder = () => {
			result = true;
		};

		// Set model
		await getEndpoint(request, response);

		// Expect goneResponder() to have been called
		expect(result).toBe(true);
	});
});
