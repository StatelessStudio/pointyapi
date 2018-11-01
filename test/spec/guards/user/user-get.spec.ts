import { pointy } from '../../../../src';
import { upgradeUserRole } from '../../../../src/upgrade-user-role';
import { BaseUser } from '../../../../src/models';
import { UserRole } from '../../../../src/enums/user-role';

const http = pointy.http;

describe('User Bodyguard Read', () => {
	beforeAll(async () => {
		this.getUser1 = await http
			.post('/api/v1/user', {
				fname: 'getUser1',
				lname: 'getUser1',
				username: 'getUser1',
				password: 'password123',
				email: 'getUser1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		this.getUser1Token = await http
			.post('/api/v1/auth', {
				user: 'getUser1',
				password: 'password123'
			})
			.catch((error) => {
				fail('Could not create User API Token');
				fail(error);
			});

		this.getUser2 = await http
			.post('/api/v1/user', {
				fname: 'getUser2',
				lname: 'getUser2',
				username: 'getUser2',
				password: 'password123',
				email: 'getUser2@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		this.userAdmin = await http
			.post('/api/v1/user', {
				fname: 'userAdmin',
				lname: 'userAdmin',
				username: 'userAdmin1',
				password: 'password123',
				email: 'userAdmin1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		this.userAdminToken = await http
			.post('/api/v1/auth', {
				user: 'userAdmin1',
				password: 'password123'
			})
			.catch((error) => {
				fail('Could not create User API Token');
				fail(error);
			});

		upgradeUserRole('userAdmin1', BaseUser, UserRole.Admin);
	});

	it('can read all', async () => {
		await http
			.get('/api/v1/user', {}, [ 200 ], this.getUser1Token.body.token)
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Array));
				expect(result.body['length']).toBeGreaterThanOrEqual(2);
			})
			.catch((error) => fail(error));
	});

	it('can read one', async () => {
		await http
			.get(
				'/api/v1/user',
				{
					id: this.user2.body.id
				},
				this.getUser1Token.body.token
			)
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Object));
				expect(result.body['fname']).toEqual('getUser2');
			})
			.catch((error) => fail(error));
	});

	it(`cannot reveal sensitive information (one)`, async () => {
		await http
			.get('/api/v1/user', {
				id: this.getUser1.body.id
			})
			.then((result) => {
				expect(result.body['username']).toEqual(jasmine.any(String));

				if (
					('password' in result.body && result.body['password']) ||
					('tempPassword' in result.body &&
						result.body['tempPassword']) ||
					('tempEmail' in result.body && result.body['tempEmail']) ||
					('role' in result.body && result.body['role']) ||
					('status' in result.body && result.body['status']) ||
					('location' in result.body && result.body['location']) ||
					('token' in result.body && result.body['token'])
				) {
					fail();
				}
			})
			.catch((error) => fail(error));
	});

	it(`cannot reveal sensitive information (all)`, async () => {
		await http
			.get('/api/v1/user')
			.then((result) => {
				expect(result.body[0]).toEqual(jasmine.any(Object));
				expect(result.body[0].username).toEqual(jasmine.any(String));

				if (
					('password' in result.body[0] && result.body['password']) ||
					('tempPassword' in result.body[0] &&
						result.body['tempPassword']) ||
					('tempEmail' in result.body[0] &&
						result.body['tempEmail']) ||
					('role' in result.body[0] && result.body['role']) ||
					('status' in result.body[0] && result.body['status']) ||
					('location' in result.body[0] && result.body['location']) ||
					('token' in result.body[0] && result.body['token'])
				) {
					fail();
				}
			})
			.catch((error) => fail(error));
	});
});
