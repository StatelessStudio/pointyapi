import { pointy } from '../../../../src';

const http = pointy.http;
describe('[Chat] Chat API Get', async () => {
	beforeAll(async () => {
		this.user = await http
			.post('/api/v1/user', {
				fname: 'Chat',
				lname: 'Tester',
				username: 'chatGet1',
				password: 'password123',
				email: 'chatGet1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		this.user2 = await http
			.post('/api/v1/user', {
				fname: 'jim',
				lname: 'Tester',
				username: 'chatGet2',
				password: 'password123',
				email: 'chatGet2@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		this.token = await http
			.post('/api/v1/auth', {
				user: 'chatGet1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		this.token2 = await http
			.post('/api/v1/auth', {
				user: 'chatGet2',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		// make chats to read

		this.chat = await http
			.post(
				'/api/v1/chat',
				{
					to: this.user2.body,
					body: 'test'
				},
				[ 200 ],
				this.token.body.token
			)
			.catch((error) =>
				fail('Could not create chat-message: ' + JSON.stringify(error))
			);

		this.chat2 = await http
			.post(
				'/api/v1/chat',
				{
					to: this.user.body,
					body: 'test2'
				},
				[ 200 ],
				this.token2.body.token
			)
			.catch((error) =>
				fail('Could not create chat-message: ' + JSON.stringify(error))
			);
	});

	it('allows a user to view their message(sent)', async () => {
		await http
			.get(
				'/api/v1/chat',
				{
					id: this.chat.body.id
				},
				[ 200 ],
				this.token.body.token
			)
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Object));
				expect(result.body['body']).toEqual('test');
			})
			.catch((error) => fail(error));
	});

	it('allows a user to view their message(received)', async () => {
		await http
			.get(
				'/api/v1/chat',
				{
					id: this.chat2.body.id
				},
				[ 200 ],
				this.token.body.token
			)
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Object));
				expect(result.body['body']).toEqual('test2');
			})
			.catch((error) => fail(error));
	});

	it('Cannot view chat w/o  a token', async () => {
		await http
			.get(
				'/api/v1/chat',
				{
					id: this.chat2.body.id
				},
				[ 401 ]
			)
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);
	});

	it('Cannot view chat with the wrong token', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'Chat',
				lname: 'Tester',
				username: 'chatGet3',
				password: 'password123',
				email: 'chatGet3@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		const wrongToken = await http
			.post('/api/v1/auth', {
				user: 'chatGet3',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		if (this.chat && wrongToken) {
			await http
				.get(
					'/api/v1/chat',
					{ id: this.chat.body['id'] },
					[ 401 ],
					wrongToken.body['token']
				)
				.catch((error) => fail(error));
		}
		else {
			fail('Could not authenticate user');
		}
	});
});
