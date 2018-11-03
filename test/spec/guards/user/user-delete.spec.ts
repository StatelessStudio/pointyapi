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
				user: 'adminGuardDel1',
				password: 'password123'
			})
			.catch((error) => {
				fail('Could not create User API Token' + JSON.stringify(error));
			});

		upgradeUserRole('adminGuardDel1', BaseUser, UserRole.Admin);
	});

	it('can delete', async () => {
		const deleteUser = await http
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

		const deleteUserToken = await http
			.post('/api/v1/auth', {
				user: 'guardUserDel1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		if (deleteUser && deleteUserToken) {
			await http
				.delete(
					`/api/v1/user/${deleteUser.body['id']}`,
					[ 204 ],
					deleteUserToken.body['token']
				)
				.catch((error) => fail(error));
		}
	});

	it('cannot delete w/o token', (done) => {
		http
			.post('/api/v1/user', {
				fname: 'deleteUser',
				lname: 'deleteUser',
				username: 'guardUserDel2',
				password: 'password123',
				email: 'guardUserDel2@test.com'
			})
			.then((result) => {
				http
					.delete(`/api/v1/user/${result.body['id']}`, [ 401 ])
					.then(done)
					.catch((error) => fail(error));
			})
			.catch((error) => fail(error));
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

		const deleteUser4 = await http
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

		const deleteUser3Token = await http
			.post('/api/v1/auth', {
				user: 'guardUserDel3',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		if (deleteUser4 && deleteUser3Token) {
			await http
				.delete(
					`/api/v1/user/${deleteUser4.body['id']}`,
					[ 401 ],
					deleteUser3Token.body['token']
				)
				.catch((error) => fail(error));
		}
	});

	it('Admin can delete', (done) => {
		http
			.post('/api/v1/user', {
				fname: 'deleteUser',
				lname: 'deleteUser',
				username: 'guardUserDel5',
				password: 'password123',
				email: 'guardUserDel5@test.com'
			})
			.then((result) => {
				http
					.delete(
						`/api/v1/user/${result.body['id']}`,
						[ 200 ],
						this.adminToken
					)
					.then(done)
					.catch((error) => fail(error));
			})
			.catch((error) => fail(error));
	});
});
