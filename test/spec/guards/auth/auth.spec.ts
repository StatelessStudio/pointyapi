import { pointy } from '../../../../src';
const http = pointy.http;

describe('[Guards] User Api Login/Logout', () => {
	let user;
	let token;

	beforeAll(async () => {
		user = await http
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

		token = await http
			.post('/api/v1/auth', {
				__user: 'userAuth1',
				password: 'password123'
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('should log in', () => {
		expect(token.body.token).toEqual(jasmine.any(String));
		expect(token.body.token.length).toBeGreaterThanOrEqual(16);
		expect(token.body.password).toBeUndefined();
		expect(token.body.expiration).toBeGreaterThan(Date.now());
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
			.delete('/api/v1/auth', token.body.token)
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('cannot log out without a token', async () => {
		await http
			.delete('/api/v1/auth', undefined, [ 401 ])
			.catch((error) => fail(JSON.stringify(error)));
	});
});
