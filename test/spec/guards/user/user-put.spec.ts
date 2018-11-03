import { pointy } from '../../../../src';
import { UserRole } from '../../../../src/enums/user-role';
const http = pointy.http;

describe('[Guards] User API Update', () => {
	beforeAll(async () => {
		this.userAdmin = await http
			.post('/api/v1/user', {
				fname: 'userAdmin',
				lname: 'userAdmin',
				username: 'adminGuardPut1',
				password: 'password123',
				email: 'userAdmin@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		this.adminToken = await http
			.post('/api/v1/auth', {
				user: 'adminGuardPut1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		this.user = await http
			.post('/api/v1/user', {
				fname: 'userPut4',
				lname: 'userPut4',
				username: 'userPut4',
				password: 'password123',
				email: 'userPut4@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		this.token = await http
			.post('/api/v1/auth', {
				user: 'userPut4',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);
	});

	it('allows users to update', async () => {
		const user = await http
			.post('/api/v1/user', {
				fname: 'userPut1',
				lname: 'userPut1',
				username: 'userPut1',
				password: 'password123',
				email: 'userPut1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		const token = await http
			.post('/api/v1/auth', {
				user: 'userPut1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		if (user && token) {
			await http
				.put(
					`/api/v1/user/${user.body['id']}`,
					{
						fname: 'updatedName'
					},
					[ 204 ],
					token.body['token']
				)
				.then(() => {
					http
						.get(
							`/api/v1/user`,
							{
								id: user.body['id']
							},
							[ 200 ]
						)
						.then((getResult) =>
							expect(getResult.body['fname']).toEqual(
								'updatedName'
							)
						)
						.catch((error) => fail(error));
				})
				.catch((error) => fail(error));
		}
	});

	it('does not allow user to update without token', () => {
		http
			.post('/api/v1/user', {
				fname: 'userPut2',
				lname: 'userPut2',
				username: 'userPut2',
				password: 'password123',
				email: 'userPut2@test.com'
			})
			.then((result) => {
				http.put(
					`/api/v1/user/${result.body['id']}`,
					{
						fname: 'noToken'
					},
					[ 401 ]
				);
			});
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

		if (user && this.token) {
			await http.put(
				`/api/v1/user/${user.body['id']}`,
				{
					fname: 'wrongToken'
				},
				[ 401 ],
				this.token.body.token
			);
		}
	});

	it('does not allow basic/tutor users to change their role', async () => {
		await http.put(
			`/api/v1/user/${this.user.body.id}`,
			{
				role: UserRole.Admin
			},
			[ 403 ],
			this.token.body.token
		);
	});

	it('allows for admin to update users', async () => {
		await http
			.put(
				`/api/v1/user/${this.user.body.id}`,
				{
					fname: 'adminUpdate'
				},
				[ 200 ],
				this.adminToken.body.token
			)
			.then((result) => {
				http
					.get(
						`/api/v1/user`,
						{
							id: this.user.body.id
						},
						[ 200 ]
					)
					.then((getResult) =>
						expect(getResult.body['fname']).toEqual('adminUpdate')
					)
					.catch((error) => fail(error));
			})
			.catch((error) => fail(error));
	});
});
