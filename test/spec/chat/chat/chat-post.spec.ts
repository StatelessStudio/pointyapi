import { pointy } from '../../../../src';

const http = pointy.http;
describe('[Chat] Chat API Post', () => {
	beforeAll(async () => {
		this.user = await http
			.post('/api/v1/user', {
				fname: 'Chat',
				lname: 'Tester',
				username: 'chatPost1',
				password: 'password123',
				email: 'chatPost1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		this.user2 = await http
			.post('/api/v1/user', {
				fname: 'jim',
				lname: 'Tester',
				username: 'chatPost2',
				password: 'password123',
				email: 'chatPost2@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		this.token = await http
			.post('/api/v1/auth', {
				user: 'chatPost1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		this.token2 = await http
			.post('/api/v1/auth', {
				user: 'chatPost2',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);
	});

	it('can create a chat message', async () => {
		await http
			.post(
				'/api/v1/chat',
				{
					to: this.user2.body,
					body: 'test'
				},
				[ 200 ],
				this.token.body.token
			)
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Object));
				expect(result).toBeGreaterThanOrEqual(1);
				expect(result.body['body']).toEqual('test');
			})
			.catch((error) => fail(error));
	});

	it('cannot post without a token', async () => {
		await http
			.post(
				'/api/v1/chat',
				{
					to: this.user2.body,
					body: 'test'
				},
				[ 401 ]
			)
			.catch((error) =>
				fail('Could not create chat: ' + JSON.stringify(error))
			);
	});
});
