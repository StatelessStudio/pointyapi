import 'jasmine';
import { getRepository } from 'typeorm';
import { ExampleUser } from '../../../../src/models';
import { createMockRequest } from '../../../../src/test-probe';
import { loadEntity } from '../../../../src/middleware';

/**
 * loadEntity()
 * pointyapi/middleware
 */
describe('[Middleware] loadEntity()', async () => {
	let user;

	beforeAll(async () => {
		// Create user
		user = new ExampleUser();
		user.fname = 'tom';
		user.lname = 'doe';
		user.username = 'tomLoadEntity';
		user.email = 'tomLoadEntity@example.com';
		user.password = 'password123';

		// Save user
		await getRepository(ExampleUser)
			.save(user);
	});

	it('can load the entity', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();
		request.params = { id: user.id };

		// Load entity
		await loadEntity(request, response, () => {
			expect(request.payload.id).toEqual(user.id);
		});
	});

	it('responds with a gone responder if the resource is not found', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();
		request.identifier = 'id';
		request.params = { id: -1 };

		// Override gone responder
		let result = false;
		response.goneResponder = () => {
			result = true;
		};

		// Load entity
		await loadEntity(request, response, () => {
			fail('Fail: Loaded entity successfully.');
		});

		expect(result).toBe(true);
	});

	it('responds with validation responder if parameter is not set', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();
		request.identifier = 'id';
		request.params = {};

		// Override error responder
		let result = false;
		response.validationResponder = () => {
			result = true;
		};

		// Load entity
		await loadEntity(request, response, () => {
			fail('Fail: Loaded entity successfully.');
		});

		expect(result).toBe(true);
	});

	it('responds with error responder if identifier is not set', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();
		request.params = {};
		request.identifier = undefined;

		// Override error responder
		let result = false;
		response.error = () => {
			result = true;
		};

		// Load entity
		await loadEntity(request, response, () => {
			fail('Fail: Loaded entity successfully.');
		});

		expect(result).toBe(true);
	});
});
