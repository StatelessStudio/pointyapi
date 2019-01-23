import { pointy } from '../../../../src';
const http = pointy.http;

describe('User API Update', () => {
	beforeAll(async () => {
		this.user1 = await http
			.post('/api/v1/user', {
				fname: 'userPut',
				lname: 'userPut',
				username: 'basicUserPut1',
				password: 'password123',
				email: 'basicUserPut1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);
	});

	it('can update', async () => {
		await http
			.put(
				`/api/v1/user/${this.user1.body.id}`,
				{
					lname: 'testLast'
				},
				[ 204 ]
			)
			.then((result) => {
				http
					.get(
						`/api/v1/user`,
						{
							id: this.user1.body.id
						},
						[ 200 ]
					)
					.then((getResult) =>
						expect(getResult.body['lname']).toEqual('testLast')
					)
					.catch((error) => fail(JSON.stringify(error)));
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can clear a field that has already been set', async () => {
		const user = await http
			.post('/api/v1/user', {
				fname: 'userPut',
				lname: 'userPut',
				username: 'basicUserPut2',
				password: 'password123',
				email: 'basicUserPut2@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		if (user) {
			await http
				.put(
					`/api/v1/user/${user.body['id']}`,
					{
						email: ''
					},
					[ 204 ]
				)
				.then((result) => {
					http
						.get(
							`/api/v1/user`,
							{
								id: user.body['id']
							},
							[ 200 ]
						)
						.then((getResult) =>
							expect(getResult.body['email']).toEqual(null)
						)
						.catch((error) => fail(JSON.stringify(error)));
				})
				.catch((error) => fail(JSON.stringify(error)));
		}
		else {
			fail('Could not create base user');
		}
	});

	it('maintains other fields on update', async () => {
		await http
			.put(
				`/api/v1/user/${this.user1.body.id}`,
				{
					lname: 'testLast'
				},
				[ 204 ]
			)
			.then((result) => {
				http
					.get(
						`/api/v1/user`,
						{
							id: this.user1.body.id
						},
						[ 200 ]
					)
					.then((getResult) =>
						expect(getResult.body['email']).toEqual(
							'basicUserPut1@test.com'
						)
					)
					.catch((error) => fail(JSON.stringify(error)));
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('cannot accept a nonsense username', async () => {
		await http
			.put(
				`/api/v1/user/${this.user1.body.id}`,
				{
					username: 'tom<tester5'
				},
				[ 400 ]
			)
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('cannot accept a nonsense email', async () => {
		await http
			.put(
				`/api/v1/user/${this.user1.body.id}`,
				{
					email: 'drew3test.com'
				},
				[ 400 ]
			)
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('removes undefined members', async () => {
		await http
			.put(
				`/api/v1/user/${this.user1.body.id}`,
				{
					biography: undefined
				},
				[ 204 ]
			)
			.catch((error) => fail(JSON.stringify(error)));
	});
});
