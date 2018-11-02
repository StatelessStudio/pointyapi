import { pointy } from '../../../../src';
const http = pointy.http;

describe('User API Read', () => {
	beforeAll(async () => {
		this.user1 = await http
			.post('/api/v1/user', {
				fname: 'getUser1',
				lname: 'getUser',
				username: 'getUser1',
				password: 'password123',
				email: 'getUser1@get.com'
			})
			.catch((error) => fail(error));

		this.user2 = await http
			.post('/api/v1/user', {
				fname: 'getUser2',
				lname: 'getUser',
				username: 'getUser2',
				password: 'password123',
				email: 'getUser2@get.com'
			})
			.catch((error) => fail(error));
	});

	it('can read all', async () => {
		await http
			.get('/api/v1/user', {}, [ 200 ])
			.then((result) => expect(result.body).toEqual(jasmine.any(Array)))
			.catch((error) => fail(error));
	});

	it('can read many', () => {
		http
			.get('/api/v1/user', {
				lname: 'getUser'
			})
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Array));
				expect(result.body['length']).toBeGreaterThanOrEqual(2);
			})
			.catch((error) => fail(error));
	});

	it('can read one', () => {
		http
			.get('/api/v1/user', {
				id: this.user1.body.id
			})
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Object));
				expect(result.body['fname']).toEqual('getUser1');
			})
			.catch((error) => fail(error));
	});

	it('returns 410 for a not found user', async () => {
		await http
			.get(
				'/api/v1/user',
				{
					id: 12345
				},
				[ 410 ]
			)
			.catch((error) => fail(error));
	});

	it('can search', async () => {
		await http
			.get('/api/v1/user', {
				search: 'getUser1'
			})
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Array));
				expect(result.body['length']).toEqual(1);
			})
			.catch((error) => fail(error));
	});
});
