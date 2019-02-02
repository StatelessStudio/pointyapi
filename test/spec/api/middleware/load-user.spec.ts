import { getRepository } from 'typeorm';
import { BaseUser } from '../../../../src/models';
import { createMockRequest } from '../../../../src/test-probe';
import { loadUser } from '../../../../src/middleware';
import { jwtBearer } from '../../../../src/jwt-bearer';

/**
 * loadUser()
 * pointyapi/middleware
 */
describe('[Middleware] loadUser()', async () => {
	beforeAll(async () => {
		// Create user
		this.user = new BaseUser();
		this.user.fname = 'tom';
		this.user.lname = 'doe';
		this.user.username = 'tomLoadUser';
		this.user.email = 'tomLoadUser@example.com';
		this.user.password = 'password123';

		// Save user
		await getRepository(BaseUser)
			.save(this.user)
			.catch((error) =>
				fail('Could not save user: ' + JSON.stringify(error))
			);

		// Create token
		this.token = jwtBearer.sign(this.user);

		// Save user token
		await getRepository(BaseUser)
			.update({ id: this.user.id }, { token: this.token })
			.catch((error) =>
				fail('Could not update user: ' + JSON.stringify(error))
			);
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
				return 'Bearer ' + this.token;
			}
			else {
				return request._header(header);
			}
		};

		// Load user
		const returnValue = await loadUser(request, response, next);

		expect(returnValue).toBe(true);
		expect(result).toEqual(jasmine.any(BaseUser));
		expect(result['id']).toEqual(this.user.id);
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
	});

	it('calls unauthorizedResponder on user not found', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create bad user & token
		const badUser = new BaseUser();
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
	});
});
