import { pointy } from '../../../../src';
import { UserRole } from '../../../../src/enums/user-role';
import { upgradeUserRole } from '../../../../src/upgrade-user-role';
import { BaseUser } from '../../../../src/models';
const http = pointy.http;

describe('[Guards] User API Create', () => {
	beforeAll(async () => {
		this.userAdmin = await http
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
			BaseUser,
			UserRole.Admin
		).catch((error) =>
			fail('Could not upgrade user role' + JSON.stringify(error))
		);

		this.adminToken = await http
			.post('/api/v1/auth', {
				user: 'adminGuardPost1',
				password: 'password123'
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('works', () => {
		expect(this.userAdmin.body).toEqual(jasmine.any(Object));
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
				[ 403 ]
			)
			.catch((error) => fail(JSON.stringify(error)));
	});
});
