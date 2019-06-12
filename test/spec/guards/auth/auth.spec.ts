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
				__user: 'userAuth1',
				password: 'password123'
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('should log in', () => {
		expect(this.token.body.token).toEqual(jasmine.any(String));
		expect(this.token.body.token.length).toBeGreaterThanOrEqual(16);
		expect(this.token.body.password).toBeUndefined();
		expect(this.token.body.expiration).toBeGreaterThan(Date.now());
	});

	it('should not log in with the wrong password', async () => {
		await http
			.post(
				'/api/v1/auth',
				{
					__user: 'userAuth1',
					password: 'invalid'
				},
				undefined,
				[ 401 ]
			)
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can log out', async () => {
		await http
			.delete('/api/v1/auth', this.token.body.token)
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('cannot log out without a token', async () => {
		await http
			.delete('/api/v1/auth', undefined, [ 401 ])
			.catch((error) => fail(JSON.stringify(error)));
	});
});
