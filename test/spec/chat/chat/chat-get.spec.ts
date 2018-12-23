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
				__user: 'chatGet1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		this.token2 = await http
			.post('/api/v1/auth', {
				__user: 'chatGet2',
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
					to: { id: this.user2.body.id },
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
					to: { id: this.user.body.id },
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
			.catch((error) => fail(JSON.stringify(error)));
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
			.catch((error) => fail(JSON.stringify(error)));
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
				__user: 'chatGet3',
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
					__search: 'test',
					to: this.user.body.id,
					from: this.user2.body.id
				},
				[ 200 ],
				this.token.body.token
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
					__search: 'chatGet1',
					__join: [ 'inbox' ]
				},
				[ 200 ],
				this.token.body.token
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
					__search: 'test',
					__whereAnyOf: {
						to: +this.user.body.id,
						from: +this.user.body.id
					}
				},
				[ 200 ],
				this.token.body.token
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
					__search: '',
					__whereAnyOf: {
						to: this.user.body.id,
						from: this.user.body.id
					}
				},
				[ 200 ],
				this.token.body.token
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

	it('can count', async () => {
		await http
			.get(
				'/api/v1/chat',
				{
					__search: '',
					__count: true,
					__whereAnyOf: {
						to: this.user.body.id,
						from: this.user.body.id
					}
				},
				[ 200 ],
				this.token.body.token
			)
			.then((result) => {
				expect(result.body['count']).toBeGreaterThanOrEqual(2);
			})
			.catch((error) => fail(JSON.stringify(error)));
	});
});
