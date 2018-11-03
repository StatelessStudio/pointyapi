import { pointy } from '../../../../src';
import { ChatStatus } from '../../../examples/chat/enums/chat-status';

const http = pointy.http;
describe('[Chat] Chat API Put', () => {
	beforeAll(async () => {
		this.user = await http
			.post('/api/v1/user', {
				fname: 'Chat',
				lname: 'Tester',
				username: 'chatPut1',
				password: 'password123',
				email: 'chatPut1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		this.user2 = await http
			.post('/api/v1/user', {
				fname: 'jim',
				lname: 'Tester',
				username: 'chatPut2',
				password: 'password123',
				email: 'chatPut2@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		this.token = await http
			.post('/api/v1/auth', {
				user: 'chatPut1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		this.token2 = await http
			.post('/api/v1/auth', {
				user: 'chatPut2',
				password: 'password123'
			})
			.catch((error) => {
				fail('Could not create User API Token' + JSON.stringify(error));
			});
	});

	it('updates message if read by user', async () => {
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
			.then(async (result) => {
				await http
					.put(
						`/api/v1/chat/${result.body['id']}`,
						{
							fromStatus: ChatStatus.Read
						},
						[ 204 ],
						this.token.body.token
					)
					.catch((error) => fail(error));
			})
			.catch((error) => fail(error));
	});

	it('Cannot update chat with the wrong token', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'Chat',
				lname: 'Tester',
				username: 'chatPut3',
				password: 'password123',
				email: 'chatPut3@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		const wrongToken = await http
			.post('/api/v1/auth', {
				user: 'chatPut3',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		const chat = await http
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

		if (chat && wrongToken) {
			await http
				.put(
					`/api/v1/chat/${chat.body['id']}`,
					{
						fromStatus: ChatStatus.Read
					},
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
