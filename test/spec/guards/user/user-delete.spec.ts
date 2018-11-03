import { pointy } from '../../../../src';
import { upgradeUserRole } from '../../../../src/upgrade-user-role';
import { BaseUser } from '../../../../src/models';
import { UserRole } from '../../../../src/enums/user-role';

const http = pointy.http;

describe('User Bodyguard Delete', () => {
	beforeAll(async () => {
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

		this.adminToken = await http
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

	it('can delete', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'deleteUser',
				lname: 'deleteUser',
				username: 'deleteUser1',
				password: 'password123',
				email: 'deleteUser1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		const deleteUserToken = await http
			.post('/api/v1/auth', {
				user: 'deleteUser1',
				password: 'password123'
			})
			.catch((error) => {
				fail('Could not create User API Token');
				fail(error);
			});

		await http
			.delete(
				`/api/v1/user/${this.deleteUser.body.id}`,
				[ 204 ],
				this.deleteUserToken.body.token
			)
			.catch((error) => fail(error));
	});

	it(`can't delete w/o token`, async () => {
		const deleteUser2 = await http
			.post('/api/v1/user', {
				fname: 'deleteUser',
				lname: 'deleteUser',
				username: 'deleteUser2',
				password: 'password123',
				email: 'deleteUser2@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);
		await http
			.delete(`/api/v1/user/${this.deleteUser2.body.id}`, [ 401 ])
			.catch((error) => fail(error));
	});

	it(`can\'t delete with the wrong token`, async () => {
		await http
			.post('/api/v1/user', {
				fname: 'deleteUser',
				lname: 'deleteUser',
				username: 'deleteUser3',
				password: 'password123',
				email: 'deleteUser3@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		const deleteUser4 = await http
			.post('/api/v1/user', {
				fname: 'deleteUser',
				lname: 'deleteUser',
				username: 'deleteUser4',
				password: 'password123',
				email: 'deleteUser4@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		const deleteUser3Token = await http
			.post('/api/v1/auth', {
				user: 'deleteUser3',
				password: 'password123'
			})
			.catch((error) => {
				fail('Could not create User API Token');
				fail(error);
			});

		await http
			.delete(
				`/api/v1/user/${this.deleteUser4.body.id}`,
				[ 401 ],
				this.deleteUser3Token.body.token
			)
			.catch((error) => fail(error));
	});

	it('Admin can delete', async () => {
		const deletUser5 = await http
			.post('/api/v1/user', {
				fname: 'deleteUser',
				lname: 'deleteUser',
				username: 'deleteUser5',
				password: 'password123',
				email: 'deleteUser5@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		await http
			.delete(
				`/api/v1/user/${this.deleteUser5.body.id}`,
				[ 204 ],
				this.adminToken.body.token
			)
			.catch((error) => fail(error));
	});
});
