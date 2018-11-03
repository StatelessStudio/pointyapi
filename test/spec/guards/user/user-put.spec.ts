import { pointy } from '../../../../src';
import { UserRole } from '../../../../src/enums/user-role';
const http = pointy.http;

describe('User Bodyguard Update', () => {
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
			.catch((error) => {
				fail('Could not create User API Token');
				fail(error);
			});

		this.userPut4 = await http
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

		this.userPut4Token = await http
			.post('/api/v1/auth', {
				user: 'userPut4',
				password: 'password123'
			})
			.catch((error) => {
				fail('Could not create User API Token');
				fail(error);
			});
	});

	it('allows users to update', async () => {
		const userPut1 = await http
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

		const userPut1Token = await http
			.post('/api/v1/auth', {
				user: 'userPut1',
				password: 'password123'
			})
			.catch((error) => {
				fail('Could not create User API Token');
				fail(error);
			});
		await http
			.put(
				`/api/v1/user/${this.result.body.id}`,
				{
					fname: 'updatedName'
				},
				[ 204 ],
				this.userPut1Token.body.token
			)
			.then((result) => {
				http
					.get(
						`/api/v1/user`,
						{
							id: this.userPut1.body.id
						},
						[ 200 ]
					)
					.then((getResult) =>
						expect(getResult.body['fname']).toEqual('updatedName')
					)
					.catch((error) => fail(error));
			})
			.catch((error) => fail(error));
	});

	it('does not allow user to udpate without token', async () => {
		const userPut2 = await http
			.post('/api/v1/user', {
				fname: 'userPut2',
				lname: 'userPut2',
				username: 'userPut2',
				password: 'password123',
				email: 'userPut2@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		await http.put(
			`/api/v1/user/${this.userPut2.body.id}`,
			{
				fname: 'noToken'
			},
			[ 401 ]
		);
	});

	it('does not allow user to update with wrong token', async () => {
		const userPut3 = await http
			.post('/api/v1/user', {
				fname: 'userPut3',
				lname: 'userPut3',
				username: 'userPut3',
				password: 'password123',
				email: 'userPut3@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		const userPut3Token = await http
			.post('/api/v1/auth', {
				user: 'userPut3',
				password: 'password123'
			})
			.catch((error) => {
				fail('Could not create User API Token');
				fail(error);
			});

		await http.put(
			`/api/v1/user/${this.userPut3.body.id}`,
			{
				fname: 'wrongToken'
			},
			[ 401 ],
			this.userPut4Token.body.token
		);
	});

	it('does not allow basic/tutor users to change their role', async () => {
		await http.put(
			`/api/v1/user/${this.userPut4.body.id}`,
			{
				role: UserRole.Admin
			},
			[ 403 ],
			this.userPut4Token.body.token
		);
	});
	it('allows for admin to update users', async () => {
		await http
			.put(
				`/api/v1/user/${this.userPut4.body.id}`,
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
							id: this.userPut4.body.id
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
