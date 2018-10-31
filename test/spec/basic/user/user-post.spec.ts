import { pointy } from '../../../../src';
const http = pointy.http;

describe('User API Create', () => {
	beforeAll(async () => {
		this.user = await http
			.post('/api/v1/user', {
				fname: 'post1',
				lname: 'post1',
				username: 'postUser1',
				password: 'password123',
				email: 'postUser1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);
	});

	it('can create a user', async () => {
		expect(this.user.body).toEqual(jasmine.any(Object));
		expect(this.user.body['fname']).toEqual('post1');
	});

	it('returns an id', () => {
		expect(this.user.body.id).toBeGreaterThanOrEqual(1);
	});

	it('cannot create duplicate usernames', async () => {
		await http
			.post(
				'/api/v1/user',
				{
					fname: 'post1',
					lname: 'post1',
					username: 'postUser1',
					password: 'password123',
					email: 'dupeUserTest1@test.com'
				},
				[ 409 ]
			)
			.catch((error) => fail(error));
	});

	it('cannot create duplicate emails', async () => {
		await http
			.post(
				'/api/v1/user',
				{
					fname: 'post1',
					lname: 'post1',
					username: 'postUser1',
					password: 'password123',
					email: 'postUser1@test.com'
				},
				[ 409 ]
			)
			.catch((error) => fail(error));
	});

	it('requires a username', async () => {
		await http
			.post(
				'/api/v1/user',
				{
					fname: 'User',
					lname: 'Tester',
					password: 'password123',
					email: 'requiredUser1@test.com'
				},
				[ 400 ]
			)
			.catch((error) => fail(error));
	});

	it('requires a password', async () => {
		await http
			.post(
				'/api/v1/user',
				{
					fname: 'User',
					lname: 'Tester',
					username: 'requiredPass1',
					email: 'requiredPass1@test.com'
				},
				[ 400 ]
			)
			.catch((error) => fail(error));
	});

	it('cannot accept a nonsense username', async () => {
		await http
			.post(
				'/api/v1/user',
				{
					fname: 'User',
					lname: 'Tester',
					username: 'invalid<username',
					password: 'password123',
					email: 'invalidUser1@test.com'
				},
				[ 400 ]
			)
			.catch((error) => fail(error));
	});

	it('cannot accept a nonsense email', async () => {
		await http
			.post(
				'/api/v1/user',
				{
					fname: 'User',
					lname: 'Tester',
					username: 'invalidEmail1',
					password: 'password123',
					email: 'drew3test.com'
				},
				[ 400 ]
			)
			.catch((error) => fail(error));
	});
});