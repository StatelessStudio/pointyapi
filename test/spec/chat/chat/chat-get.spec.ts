import { pointy } from '../../../../src';
import { User } from '../../../examples/chat/models/user';
import { HttpClientResponse } from 'http/http-client-response';

const http = pointy.http;
describe('[Chat] Chat API Get', async () => {
	let user: any;
	let user2: any;
	let token;
	let token2;
	let chat;
	let chat2;

	beforeAll(async () => {
		user = await http
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

		user2 = await http
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

		token = await http
			.post('/api/v1/auth', {
				__user: 'chatGet1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		token2 = await http
			.post('/api/v1/auth', {
				__user: 'chatGet2',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		// make chats to read
		chat = await http
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

		chat2 = await http
			.post(
				'/api/v1/chat',
				{
					to: { id: user.body.id },
					body: 'test2'
				},
				token2.body.token
			)
			.catch((error) =>
				fail('Could not create chat-message: ' + JSON.stringify(error))
			);
	});

	it('allows a user to view their message (sent)', async () => {
		await http
			.get(
				'/api/v1/chat',
				{
					id: chat.body.id
				},
				token.body.token
			)
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Object));
				expect(result.body['body']).toEqual('test');
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('allows a user to view their message (received)', async () => {
		await http
			.get(
				'/api/v1/chat',
				{
					id: chat2.body.id
				},
				token.body.token
			)
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Object));
				expect(result.body['body']).toEqual('test2');
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('cannot view chat without a token', async () => {
		await http
			.get(
				'/api/v1/chat',
				{
					id: chat2.body.id
				},
				undefined,
				[ 401 ]
			)
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);
	});

	it('cannot view chat with the wrong token', async () => {
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
				__user: 'chatGet3',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		if (chat && wrongToken) {
			await http
				.get(
					'/api/v1/chat',
					{ id: chat.body['id'] },
					wrongToken.body['token'],
					[ 403 ]
				)
				.catch((error) => fail(JSON.stringify(error)));
		}
		else {
			fail('Could not authenticate user');
		}
	});

	it('can search by user', async () => {
		await http
			.get(
				'/api/v1/chat',
				{
					search: 'test',
					where: {
						to: user.body.id,
						from: user2.body.id
					}
				},
				token.body.token
			)
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Array));
				expect(result.body['length']).toEqual(1);
				expect(result.body[0]).toEqual(jasmine.any(Object));
				expect(result.body[0].id).toBeGreaterThanOrEqual(1);
				expect(result.body[0].from).toEqual(jasmine.any(Object));
				expect(result.body[0].from.id).toBeGreaterThanOrEqual(1);
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can join members', async () => {
		await http
			.get(
				'/api/v1/user',
				{
					search: 'chatGet1',
					join: [ 'inbox' ]
				},
				token.body.token
			)
			.then((result) => {
				expect(result.body['length']).toEqual(1);
				expect(result.body[0]).toEqual(jasmine.any(Object));
				expect(result.body[0].id).toBeGreaterThanOrEqual(1);
				expect(result.body[0].inbox).toEqual(jasmine.any(Array));
				expect(result.body[0].inbox.length).toBe(1);
				expect(result.body[0].inbox[0].id).toBeGreaterThanOrEqual(1);
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can search by to or from', async () => {
		await http
			.get(
				'/api/v1/chat',
				{
					search: 'test',
					whereAnyOf: {
						to: +user.body.id,
						from: +user.body.id
					}
				},
				token.body.token
			)
			.then((result) => {
				expect(result.body['length']).toEqual(2);
				expect(result.body[0]).toEqual(jasmine.any(Object));
				expect(result.body[0].id).toBeGreaterThanOrEqual(1);
				expect(result.body[0].from).toEqual(jasmine.any(Object));
				expect(result.body[0].from.id).toBeGreaterThanOrEqual(1);
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('filters nested objects', async () => {
		await http
			.get(
				'/api/v1/chat',
				{
					whereAnyOf: {
						to: user.body.id,
						from: user.body.id
					}
				},
				token.body.token
			)
			.then((result) => {
				expect(result.body['length']).toBeGreaterThanOrEqual(1);

				for (let i = 0; i < result.body['length']; i++) {
					expect(result.body[i]).toEqual(jasmine.any(Object));
					expect(result.body[i].id).toBeGreaterThanOrEqual(1);
					expect(result.body[i].from).toEqual(jasmine.any(Object));
					expect(result.body[i].from.id).toBeGreaterThanOrEqual(1);
					expect(result.body[i].from.password).toBeUndefined();
					expect(result.body[i].to).toEqual(jasmine.any(Object));
					expect(result.body[i].to.id).toBeGreaterThanOrEqual(1);
					expect(result.body[i].to.password).toBeUndefined();
				}
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('does not return chats the user does not own', async () => {
		const user: any = await http
			.post('/api/v1/user', {
				fname: 'Chat',
				lname: 'Hacker',
				username: 'chatHacker',
				password: 'password123',
				email: 'chatHacker@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		const token = await http
			.post('/api/v1/auth', {
				__user: 'chatHacker',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		if (token) {
			await http
				.get(
					'/api/v1/chat',
					{
						whereAnyOf: {
							to: user.body.id,
							from: user.body.id
						}
					},
					token.body['token']
				)
				.then((result) => {
					expect(result.body['length']).toBe(0);
				})
				.catch((error) => fail(JSON.stringify(error)));
		}
	});

	it('can count', async () => {
		await http
			.get(
				'/api/v1/chat',
				{
					count: true,
					whereAnyOf: {
						to: user.body.id,
						from: user.body.id
					}
				},
				token.body.token
			)
			.then((result) => {
				expect(result.body['count']).toBeGreaterThanOrEqual(2);
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can search by nested objects', async () => {
		const user = await http
			.post('/api/v1/user', {
				fname: 'Nested',
				lname: 'Tester',
				username: 'nestedGet1',
				password: 'password123',
				email: 'nestedGet1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		const token = await http
			.post('/api/v1/auth', {
				__user: 'nestedGet1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		if (user && token) {
			const chat = await http
				.post(
					'/api/v1/chat',
					{
						to: { id: user.body['id'] },
						body: 'test'
					},
					token.body['token']
				)
				.catch((error) =>
					fail(
						'Could not create chat-message: ' +
							JSON.stringify(error)
					)
				);

			await http
				.get(
					'/api/v1/chat',
					{
						search: 'nestedGet1'
					},
					token.body['token']
				)
				.then((result) => {
					if (result.body instanceof Array) {
						expect(result.body['length']).toEqual(1);
						result.body.forEach((chatResult) => {
							expect(chatResult.from.username).toEqual(
								'nestedGet1'
							);
						});
					}
					else {
						fail('Result is not an array.');
					}
				})
				.catch((error) => fail(JSON.stringify(error)));
		}
		else {
			fail('Could not create base user =and/or chat');
		}
	});

	it('can sort by nested objects', async () => {
		await http
			.get(
				'/api/v1/chat',
				{
					orderBy: {
						'from.username': 'DESC'
					}
				},
				token.body.token
			)
			.then((result) => {
				if (result.body instanceof Array) {
					expect(result.body.length).toBeGreaterThanOrEqual(2);

					let firstId;
					let secondId;

					result.body.forEach((chat, i) => {
						if (i === 0) {
							firstId = chat.from.id;
						}
						else if (i === 1) {
							secondId = chat.from.id;
						}
					});

					expect(firstId).toBeGreaterThan(secondId);
				}
				else {
					fail('Result is not an array');
				}
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can sort by member when a join column is included', async () => {
		await http
			.get(
				'/api/v1/chat',
				{
					join: [ 'from' ],
					orderBy: {
						id: 'ASC'
					}
				},
				token.body.token
			)
			.then((result) => {
				if (result.body instanceof Array) {
					expect(result.body.length).toBeGreaterThanOrEqual(2);
				}
				else {
					fail('Result is not an array');
				}
			})
			.catch((error) => fail(JSON.stringify(error)));
	});
});
