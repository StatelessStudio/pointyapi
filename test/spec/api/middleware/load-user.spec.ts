import { getRepository } from 'typeorm';
import { ExampleUser } from '../../../../src/models';
import { createMockRequest } from '../../../../src/test-probe';
import { loadUser } from '../../../../src/middleware';
import { jwtBearer } from '../../../../src/jwt-bearer';

/**
 * loadUser()
 * pointyapi/middleware
 */
describe('[Middleware] loadUser()', async () => {
	let user;
	let token;

	beforeAll(async () => {
		// Create user
		user = new ExampleUser();
		user.fname = 'tom';
		user.lname = 'doe';
		user.username = 'tomLoadUser';
		user.email = 'tomLoadUser@example.com';
		user.password = 'password123';

		// Save user
		await getRepository(ExampleUser)
			.save(user)
			.catch((error) =>
				fail('Could not save user: ' + JSON.stringify(error))
			);

		// Create token
		token = jwtBearer.sign(user);
	});

	it('loads request.user on valid token', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create success handler
		let result = false;
		const next = () => {
			result = request.user;
		};

		// Override response.header
		request._header = request.header;
		request.header = (header) => {
			if (header === 'Authorization') {
				return 'Bearer ' + token;
			}
			else {
				return request._header(header);
			}
		};

		// Load user
		const returnValue = await loadUser(request, response, next);

		expect(returnValue).toBe(true);
		expect(result).toEqual(jasmine.any(ExampleUser));
		expect(result['id']).toEqual(user.id);
	});

	it('calls unauthorizedResponder on bad token', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Override response.header
		request._header = request.header;
		request.header = (header) => {
			if (header === 'Authorization') {
				return 'Bearer ' + 'bad-token';
			}
			else {
				return request._header(header);
			}
		};

		// Override response.unauthorizedResponder
		let result = false;
		response.unauthorizedResponder = () => {
			result = true;
		};

		// Load user
		const returnValue = await loadUser(request, response, fail);

		expect(returnValue).toBe(false);
		expect(result).toBe(true);
	});

	it('calls unauthorizedResponder on user not found', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create bad user & token
		const badUser = new ExampleUser();
		badUser.id = 99999;

		const badToken = jwtBearer.sign(badUser);

		// Override response.header
		request._header = request.header;
		request.header = (header) => {
			if (header === 'Authorization') {
				return 'Bearer ' + badToken;
			}
			else {
				return request._header(header);
			}
		};

		// Override response.unauthorizedResponder
		let result = false;
		response.unauthorizedResponder = () => {
			result = true;
		};

		// Load user
		const returnValue = await loadUser(request, response, () => {
			fail('Loaded non-saved user.');
			console.warn('user', request.user);
		});

		expect(returnValue).toBe(false);
		expect(result).toBe(true);
	});

	it('skips if the request does not have a token', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();
		request._header = request.header;
		request.header = (header) => {
			if (header === 'Authorization') {
				return false;
			}
			else {
				return request._header(header);
			}
		};

		let result = false;
		await loadUser(request, response, () => (result = true));

		expect(result).toBe(true);
	});
});
