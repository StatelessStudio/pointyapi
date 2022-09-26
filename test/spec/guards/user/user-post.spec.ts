import 'jasmine';
import { pointy } from '../../../../src';
import { UserRole } from '../../../../src/enums/user-role';
import { upgradeUserRole } from '../../../../src/utils/upgrade-user-role';
import { ExampleUser } from '../../../../src/models';
const http = pointy.http;

describe('[Guards] User API Create', () => {
	let userAdmin;
	let adminToken;

	beforeAll(async () => {
		userAdmin = await http
			.post('/api/v1/user', {
				fname: 'userAdmin1',
				lname: 'userAdmin1',
				username: 'adminGuardPost1',
				password: 'password123',
				email: 'userAdmin1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		await upgradeUserRole(
			'adminGuardPost1',
			ExampleUser,
			UserRole.Admin
		).catch((error) =>
			fail('Could not upgrade user role' + JSON.stringify(error))
		);

		adminToken = await http
			.post('/api/v1/auth', {
				__user: 'adminGuardPost1',
				password: 'password123'
			});
	});

	it('works', () => {
		expect(userAdmin.body).toEqual(jasmine.any(Object));
	});

	it('cannot set role', async () => {
		await http
			.post(
				'/api/v1/user',
				{
					fname: 'postUser1',
					lname: 'postUser1',
					username: 'postUser1',
					password: 'password123',
					email: 'postUser1@test.com',
					role: UserRole.Admin
				},
				undefined,
				[ 403 ]
			);
	});

	it('can write underscored keys', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'postUser1',
				lname: 'postUser1',
				username: 'postUser1',
				password: 'password123',
				email: 'postUser1@test.com',
				__ignore: 'test',
				___ignore: 'test'
			});
	});

	it('cannot reveal sensitve fields', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'sensitveUser1',
				lname: 'sensitveUser1',
				username: 'sensitveUser1',
				password: 'password123',
				email: 'sensitveUser1@test.com',
				__ignore: 'test',
				___ignore: 'test'
			})
			.then((result) => {
				expect(result.body['username']).toEqual(jasmine.any(String));

				if (
					('password' in result.body && result.body['password']) ||
					('tempPassword' in result.body &&
						result.body['tempPassword']) ||
					('tempEmail' in result.body && result.body['tempEmail']) ||
					('token' in result.body && result.body['token'])
				) {
					fail();
				}
			});
	});
});
