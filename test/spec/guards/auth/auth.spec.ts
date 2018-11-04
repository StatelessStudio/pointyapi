import { pointy } from '../../../../src';
const http = pointy.http;

describe('[Guards] User Api Login/Logout', () => {
	beforeAll(async () => {
		this.user = await http
			.post('/api/v1/user', {
				fname: 'userAuth',
				lname: 'userAuth',
				username: 'userAuth1',
				password: 'password123',
				email: 'userAuth1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		this.token = await http
			.post('/api/v1/auth', {
				user: 'userAuth1',
				password: 'password123'
			})
			.catch((error) => fail(error));
	});

	it('should log in', async () => {
		expect(this.token.body.token).toEqual(jasmine.any(String));
		expect(this.token.body.token.length).toBeGreaterThanOrEqual(16);
	});

	it('should not log in with the wrong password', async () => {
		await http
			.post(
				'/api/v1/auth',
				{
					user: 'userAuth1',
					password: 'invalid'
				},
				[ 401 ]
			)
			.catch((error) => fail(error));
	});

	it('can log out', async () => {
		await http
			.delete('/api/v1/auth', [ 204 ], this.token.body.token)
			.catch((error) => fail(error));
	});

	it('cannot log out without a token', async () => {
		await http
			.delete('/api/v1/auth', [ 401 ])
			.catch((error) => fail(error));
	});
});
