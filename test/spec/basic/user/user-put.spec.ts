import { pointy } from '../../../../src';
const http = pointy.http;

describe('User API Update', () => {
	beforeAll(async () => {
		this.user1 = await http
			.post('/api/v1/user', {
				fname: 'userPut',
				lname: 'userPut',
				username: 'userPut1',
				password: 'password123',
				email: 'userPut1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);
	});

	it('can update', () => {
		http
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
					.catch((error) => fail(error));
			})
			.catch((error) => fail(error));
	});

	it('maintains other fields on update', () => {
		http
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
							'userPut1@test.com'
						)
					)
					.catch((error) => fail(error));
			})
			.catch((error) => fail(error));
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
			.catch((error) => fail(error));
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
			.catch((error) => fail(error));
	});
});
