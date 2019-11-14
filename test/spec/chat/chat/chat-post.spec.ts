import { pointy } from '../../../../src';

const http = pointy.http;
describe('[Chat] Chat API Post', () => {
	let user;
	let user2;
	let token;
	let token2;

	beforeAll(async () => {
		user = await http
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

		user2 = await http
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

		token = await http
			.post('/api/v1/auth', {
				__user: 'chatPost1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + JSON.stringify(error))
			);

		token2 = await http
			.post('/api/v1/auth', {
				__user: 'chatPost2',
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
					to: { id: user2.body.id },
					body: 'test'
				},
				token.body.token
			)
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Object));
				expect(result.body['body']).toEqual('test');
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can post an array of chat messages', async () => {
		await http
			.post(
				'/api/v1/chat',
				[
					{
						to: { id: user2.body.id },
						body: 'test array 1'
					},
					{
						to: { id: user2.body.id },
						body: 'test array 2'
					}
				],
				token.body.token
			)
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Array));
				expect(result.body[0]['body']).toEqual('test array 1');
				expect(result.body[0]['to']['password']).toBeUndefined();
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('cannot post without a token', async () => {
		await http
			.post(
				'/api/v1/chat',
				{
					to: { id: user2.body.id },
					body: 'test'
				},
				undefined,
				[ 401 ]
			)
			.catch((error) =>
				fail('Could not create chat: ' + JSON.stringify(error))
			);
	});

	it('cannot reveal sensitive user fields', async () => {
		await http
			.post(
				'/api/v1/chat',
				{
					to: { id: user2.body.id },
					body: 'test'
				},
				token.body.token
			)
			.then((result) => {
				expect(result.body['id']).toBeGreaterThanOrEqual(1);

				if (
					('password' in result.body['to'] &&
						result.body['to']['password']) ||
					('tempPassword' in result.body['to'] &&
						result.body['to']['tempPassword']) ||
					('tempEmail' in result.body['to'] &&
						result.body['to']['tempEmail']) ||
					('token' in result.body['to'] && result.body['to']['token'])
				) {
					fail();
				}
			})
			.catch((error) =>
				fail('Could not create chat: ' + JSON.stringify(error))
			);
	});
});
