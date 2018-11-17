import { pointy } from '../../../../src';
import { upgradeUserRole } from '../../../../src/upgrade-user-role';
import { BaseUser } from '../../../../src/models';
import { UserRole } from '../../../../src/enums/user-role';

const http = pointy.http;

describe('[Guards] User API Delete', () => {
	beforeAll(async () => {
		this.userAdmin = await http
			.post('/api/v1/user', {
				fname: 'userAdmin',
				lname: 'userAdmin',
				username: 'adminGuardDel1',
				password: 'password123',
				email: 'adminGuardDel1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		this.adminToken = await http
			.post('/api/v1/auth', {
				__user: 'adminGuardDel1',
				password: 'password123'
			})
			.catch((error) => {
				fail('Could not create User API Token' + JSON.stringify(error));
			});

		await upgradeUserRole(
			'adminGuardDel1',
			BaseUser,
			UserRole.Admin
		).catch((error) =>
			fail('Could not upgrade user role' + JSON.stringify(error))
		);
	});

	it('can delete', async () => {
		const user = await http
			.post('/api/v1/user', {
				fname: 'deleteUser',
				lname: 'deleteUser',
				username: 'guardUserDel1',
				password: 'password123',
				email: 'guardUserDel1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		const token = await http
			.post('/api/v1/auth', {
				__user: 'guardUserDel1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		if (user && token) {
			await http
				.delete(
					`/api/v1/user/${user.body['id']}`,
					[ 204 ],
					token.body['token']
				)
				.catch((error) => fail(JSON.stringify(error)));
		}
		else {
			fail();
		}
	});

	it('cannot delete w/o token', async () => {
		const result = await http
			.post('/api/v1/user', {
				fname: 'deleteUser',
				lname: 'deleteUser',
				username: 'guardUserDel2',
				password: 'password123',
				email: 'guardUserDel2@test.com'
			})
			.catch((error) => fail(JSON.stringify(error)));

		if (result) {
			await http
				.delete(`/api/v1/user/${result.body['id']}`, [ 401 ])
				.catch((error) => fail(JSON.stringify(error)));
		}
	});

	it(`can\'t delete with the wrong token`, async () => {
		await http
			.post('/api/v1/user', {
				fname: 'deleteUser',
				lname: 'deleteUser',
				username: 'guardUserDel3',
				password: 'password123',
				email: 'guardUserDel3@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		const user = await http
			.post('/api/v1/user', {
				fname: 'deleteUser',
				lname: 'deleteUser',
				username: 'guardUserDel4',
				password: 'password123',
				email: 'guardUserDel4@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		const token = await http
			.post('/api/v1/auth', {
				__user: 'guardUserDel3',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		if (user && token) {
			await http
				.delete(
					`/api/v1/user/${user.body['id']}`,
					[ 401 ],
					token.body['token']
				)
				.catch((error) => fail(JSON.stringify(error)));
		}
		else {
			fail();
		}
	});

	it('Admin can delete', async () => {
		const result = await http
			.post('/api/v1/user', {
				fname: 'deleteUser',
				lname: 'deleteUser',
				username: 'guardUserDel5',
				password: 'password123',
				email: 'guardUserDel5@test.com'
			})
			.catch((error) => fail(JSON.stringify(error)));

		if (result) {
			await http
				.delete(
					`/api/v1/user/${result.body['id']}`,
					[ 204 ],
					this.adminToken.body.token
				)
				.catch((error) => fail(JSON.stringify(error)));
		}
	});
});
