import { pointy } from '../../../../src';
import { upgradeUserRole } from '../../../../src/utils/upgrade-user-role';
import { BaseUser } from '../../../../src/models';
import { UserRole } from '../../../../src/enums/user-role';

const http = pointy.http;

describe('[Guards] User API Read', () => {
	beforeAll(async () => {
		this.getUser1 = await http
			.post('/api/v1/user', {
				fname: 'getUser1',
				lname: 'getUser1',
				username: 'guardUserGet1',
				password: 'password123',
				email: 'guardUserGet1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		this.getUser1Token = await http
			.post('/api/v1/auth', {
				__user: 'guardUserGet1',
				password: 'password123'
			})
			.catch((error) => {
				fail('Could not create User API Token' + JSON.stringify(error));
			});

		this.getUser2 = await http
			.post('/api/v1/user', {
				fname: 'getUser2',
				lname: 'getUser2',
				username: 'guardUserGet2',
				password: 'password123',
				email: 'guardUserGet2@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		this.userAdmin = await http
			.post('/api/v1/user', {
				fname: 'userAdmin',
				lname: 'userAdmin',
				username: 'adminGuardGet1',
				password: 'password123',
				email: 'adminGuardGet1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		this.adminToken = await http
			.post('/api/v1/auth', {
				__user: 'adminGuardGet1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + +JSON.stringify(error))
			);

		await upgradeUserRole(
			'adminGuardGet1',
			BaseUser,
			UserRole.Admin
		).catch((error) =>
			fail('Could not upgrade user role' + JSON.stringify(error))
		);
	});

	it('can read all', async () => {
		await http
			.get('/api/v1/user', {}, [ 200 ], this.getUser1Token.body.token)
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Array));
				expect(result.body['length']).toBeGreaterThanOrEqual(2);
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can read one', async () => {
		await http
			.get(
				'/api/v1/user',
				{
					id: this.getUser2.body.id
				},
				[ 200 ],
				this.getUser1Token.body.token
			)
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Object));
				expect(result.body['fname']).toEqual('getUser2');
			})
			.catch((error) => fail(JSON.stringify(error)));
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
					('token' in result.body && result.body['token'])
				) {
					fail();
				}
			})
			.catch((error) => fail(JSON.stringify(error)));
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
					('token' in result.body[0] && result.body['token'])
				) {
					fail();
				}
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can count', async () => {
		await http
			.get('/api/v1/user', {
				search: '',
				count: true
			})
			.then((result) => {
				expect(result.body['count']).toBeGreaterThanOrEqual(3);
			})
			.catch((error) => fail(JSON.stringify(error)));

		await http
			.get('/api/v1/user', {
				search: 'guardUserGet1',
				count: true
			})
			.then((result) => {
				expect(result.body['count']).toEqual(1);
			})
			.catch((error) => fail(JSON.stringify(error)));

		await http
			.get('/api/v1/user', {
				search: '',
				count: true,
				where: {
					username: 'guardUserGet1'
				}
			})
			.then((result) => {
				expect(result.body['count']).toEqual(1);
			})
			.catch((error) => fail(JSON.stringify(error)));
	});
});
