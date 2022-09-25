import 'jasmine';
import { pointy } from '../../../../src';
import { ChatStatus } from '../../../examples/chat/enums/chat-status';
import { stringify } from 'querystring';
import { log } from 'util';

const http = pointy.http;
describe('[Chat] Chat API Patch', () => {
	let user;
	let user2;
	let token;
	let token2;

	beforeAll(async () => {
		user = await http
			.post('/api/v1/user', {
				fname: 'Chat',
				lname: 'Tester',
				username: 'chatPatch1',
				password: 'password123',
				email: 'chatPatch1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		user2 = await http
			.post('/api/v1/user', {
				fname: 'jim',
				lname: 'Tester',
				username: 'chatPatch2',
				password: 'password123',
				email: 'chatPatch2@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		token = await http
			.post('/api/v1/auth', {
				__user: 'chatPatch1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		token2 = await http
			.post('/api/v1/auth', {
				__user: 'chatPatch2',
				password: 'password123'
			})
			.catch((error) => {
				fail('Could not create User API Token' + JSON.stringify(error));
			});
	});

	it('can change the status', async () => {
		const result = await http
			.post(
				'/api/v1/chat',
				{
					to: { id: user2.body.id },
					body: 'test'
				},
				token.body.token
			);

		if (result) {
			await http
				.patch(
					`/api/v1/chat/${result.body['id']}`,
					{
						fromStatus: ChatStatus.Read
					},
					token.body.token
				);
		}
	});

	it('cannot update chat with the wrong token', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'Chat',
				lname: 'Tester',
				username: 'chatPatch3',
				password: 'password123',
				email: 'chatPatch3@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		const wrongToken = await http
			.post('/api/v1/auth', {
				__user: 'chatPatch3',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		const chat = await http
			.post(
				'/api/v1/chat',
				{
					to: { id: user2.body.id },
					body: 'test'
				},
				token.body.token
			)
			.catch((error) =>
				fail('Could not create chat-message: ' + JSON.stringify(error))
			);

		if (chat && wrongToken) {
			await http
				.patch(
					`/api/v1/chat/${chat.body['id']}`,
					{
						fromStatus: ChatStatus.Read
					},
					wrongToken.body['token'],
					[ 403 ]
				);
		}
		else {
			fail('Could not authenticate user');
		}
	});

	it('can update boolean values', async () => {
		const result = await http
			.post(
				'/api/v1/chat',
				{
					to: { id: user2.body.id },
					body: 'test'
				},
				token.body.token
			);

		if (result) {
			await http
				.patch(
					`/api/v1/chat/${result.body['id']}`,
					{
						booleanTest: true
					},
					token.body.token
				);

			const chat = await http
				.get(
					'/api/v1/chat',
					{ id: result.body['id'] },
					token.body.token
				);

			expect(chat['body']['booleanTest']).toBe(true);
		}
		else {
			fail('Could not create base chat');
		}
	});
});
