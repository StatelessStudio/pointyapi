import { pointy } from '../../../../src';
import { upgradeUserRole } from '../../../../src/upgrade-user-role';
import { User } from '../../../examples/chat/models/user';
import { UserRole } from '../../../../src/enums';

const http = pointy.http;
describe('[Chat] Chat API Delete', () => {
	beforeAll(async () => {
		this.user = await http
			.post('/api/v1/user', {
				fname: 'Chat',
				lname: 'Tester',
				username: 'chatUser1',
				password: 'password123',
				email: 'chatUser1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		this.user2 = await http
			.post('/api/v1/user', {
				fname: 'jim',
				lname: 'Tester',
				username: 'chatUser2',
				password: 'password123',
				email: 'chatUser2@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		this.adminUser = await http
			.post('/api/v1/user', {
				fname: 'jim',
				lname: 'Tester',
				username: 'chatAdmin1',
				password: 'password123',
				email: 'chatAdmin1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		this.token = await http
			.post('/api/v1/auth', {
				user: 'chatUser1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		this.token2 = await http
			.post('/api/v1/auth', {
				user: 'chatUser2',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		this.adminToken = await http
			.post('/api/v1/auth', {
				user: 'chatAdmin1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		upgradeUserRole('chatAdmin1', User, UserRole.Admin);
	});

	it('can delete', async () => {
		const chat = await http
			.post(
				'/api/v1/chat',
				{
					to: { id: this.user2.body.id },
					body: 'test'
				},
				[ 200 ],
				this.token.body.token
			)
			.catch((error) =>
				fail('Could not create chat-message: ' + JSON.stringify(error))
			);

		if (chat && this.token) {
			await http
				.delete(
					`/api/v1/chat/${chat.body['id']}`,
					[ 204 ],
					this.token.body.token
				)
				.catch((error) => fail(JSON.stringify(error)));
		}
		else {
			fail('Could not authenticate user');
		}
	});

	it('cannot delete w/o token', async () => {
		await http
			.post(
				'/api/v1/chat',
				{
					to: { id: this.user2.body.id },
					body: 'test'
				},
				[ 200 ],
				this.token.body.token
			)
			.then(async (result) => {
				await http
					.delete(`/api/v1/chat/${result.body['id']}`, [ 401 ])
					.catch((error) => fail(JSON.stringify(error)));
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('cannot delete with the wrong token', async () => {
		// Create user
		await http
			.post('/api/v1/user', {
				fname: 'Henry',
				lname: 'Hacker',
				username: 'chatDelete1',
				password: 'password123',
				email: 'chatDelete1@test.com'
			})
			.catch((error) =>
				fail('Could not create chat-message: ' + JSON.stringify(error))
			);

		// Authenticate
		const wrongToken = await http
			.post('/api/v1/auth', {
				user: 'chatDelete1',
				password: 'password123'
			})
			.catch((error) => {
				fail('Could not create User API Token' + JSON.stringify(error));
			});

		// create a chat
		const chat = await http
			.post(
				'/api/v1/chat',
				{
					to: { id: this.user2.body.id },
					body: 'test'
				},
				[ 200 ],
				this.token.body.token
			)
			.catch((error) =>
				fail('Could not create chat-message: ' + JSON.stringify(error))
			);

		// Send delete request
		if (chat && wrongToken) {
			await http
				.delete(
					`/api/v1/chat/${chat.body['id']}`,
					[ 401 ],
					wrongToken.body['token']
				)
				.catch((error) => fail(JSON.stringify(error)));
		}
		else {
			fail('Could not authenticate user');
		}
	});

	it('allows admin to delete chat messages', async () => {
		await http
			.post(
				'/api/v1/chat',
				{
					to: { id: this.user2.body.id },
					body: 'test'
				},
				[ 200 ],
				this.token.body.token
			)
			.then(async (result) => {
				await http
					.delete(
						`/api/v1/chat/${result.body['id']}`,
						[ 204 ],
						this.adminToken.body.token
					)
					.catch((error) => fail(JSON.stringify(error)));
			})
			.catch((error) => fail(JSON.stringify(error)));
	});
});