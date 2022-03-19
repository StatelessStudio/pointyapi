import { pointy } from '../../../../src';
import { UserRole } from '../../../../src/enums/user-role';
import { upgradeUserRole } from '../../../../src/utils/upgrade-user-role';
import { ExampleUser } from '../../../../src/models';

const http = pointy.http;

describe('[Guards] User API Update', () => {
	let userAdmin;
	let adminToken;
	let user;
	let token;

	beforeAll(async () => {
		userAdmin = await http
			.post('/api/v1/user', {
				fname: 'userAdmin',
				lname: 'userAdmin',
				username: 'adminGuardPatch1',
				password: 'password123',
				email: 'userAdmin@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		await upgradeUserRole('adminGuardPatch1', ExampleUser, UserRole.Admin);

		adminToken = await http
			.post('/api/v1/auth', {
				__user: 'adminGuardPatch1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		user = await http
			.post('/api/v1/user', {
				fname: 'userPatch4',
				lname: 'userPatch4',
				username: 'userPatch4',
				password: 'password123',
				email: 'userPatch4@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		token = await http
			.post('/api/v1/auth', {
				__user: 'userPatch4',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);
	});

	it('allows users to update', async () => {
		const user = await http
			.post('/api/v1/user', {
				fname: 'userPatch1',
				lname: 'userPatch1',
				username: 'userPatch1',
				password: 'password123',
				email: 'userPatch1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		const token = await http
			.post('/api/v1/auth', {
				__user: 'userPatch1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		if (user && token) {
			const result = await http
				.patch(
					`/api/v1/user/${user.body['id']}`,
					{
						fname: 'updatedName'
					},
					token.body['token']
				)
				.catch((error) => fail(JSON.stringify(error)));

			const getResult = await http
				.get(`/api/v1/user`, {
					id: user.body['id']
				})
				.catch((error) => fail(JSON.stringify(error)));

			if (result && getResult) {
				expect(getResult.body['fname']).toEqual('updatedName');
			}
		}
		else {
			fail();
		}
	});

	it('does not allow user to update without token', async () => {
		const result = await http
			.post('/api/v1/user', {
				fname: 'userPatch2',
				lname: 'userPatch2',
				username: 'userPatch2',
				password: 'password123',
				email: 'userPatch2@test.com'
			})
			.catch((error) => fail(JSON.stringify(error)));

		if (result) {
			await http
				.patch(
					`/api/v1/user/${result.body['id']}`,
					{
						fname: 'noToken'
					},
					undefined,
					[ 401 ]
				)
				.catch((error) => fail(JSON.stringify(error)));
		}
	});

	it('does not allow user to update with wrong token', async () => {
		const user = await http
			.post('/api/v1/user', {
				fname: 'user',
				lname: 'user',
				username: 'userPost123',
				password: 'password123',
				email: 'user@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		if (user && token) {
			await http
				.patch(
					`/api/v1/user/${user.body['id']}`,
					{
						fname: 'wrongToken'
					},
					token.body.token,
					[ 403 ]
				)
				.catch((error) => fail(JSON.stringify(error)));
		}
		else {
			fail();
		}
	});

	it('does not allow users to change their role', async () => {
		await http
			.patch(
				`/api/v1/user/${user.body.id}`,
				{
					role: UserRole.Admin
				},
				token.body.token,
				[ 403 ]
			)
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('allows for admin to update users', async () => {
		const result = await http
			.patch(
				`/api/v1/user/${user.body.id}`,
				{
					fname: 'adminUpdate'
				},
				adminToken.body.token
			)
			.catch((error) => fail(JSON.stringify(error)));

		const getResult = await http
			.get(
				`/api/v1/user`,
				{
					id: user.body.id
				},
				token.body.token
			)
			.catch((error) => fail(JSON.stringify(error)));

		if (result && getResult) {
			expect(getResult.body['fname']).toEqual('adminUpdate');
		}
	});
});
