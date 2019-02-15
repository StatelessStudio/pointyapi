import { getRepository } from 'typeorm';
import { BaseUser } from '../../../../src/models';
import { createMockRequest } from '../../../../src/test-probe';
import { loadEntity } from '../../../../src/middleware';

/**
 * loadEntity()
 * pointyapi/middleware
 */
describe('[Middleware] loadEntity()', async () => {
	beforeAll(async () => {
		// Create user
		this.user = new BaseUser();
		this.user.fname = 'tom';
		this.user.lname = 'doe';
		this.user.username = 'tomLoadEntity';
		this.user.email = 'tomLoadEntity@example.com';
		this.user.password = 'password123';

		// Save user
		await getRepository(BaseUser)
			.save(this.user)
			.catch(() => fail('Could not save user.'));
	});

	it('can load the entity', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();
		request.params = { id: this.user.id };

		// Load entity
		await loadEntity(request, response, () => {
			expect(request.payload.id).toEqual(this.user.id);
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
