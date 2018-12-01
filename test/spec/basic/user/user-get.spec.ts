import { pointy } from '../../../../src';
const http = pointy.http;

describe('User API Read', () => {
	beforeAll(async () => {
		this.user1 = await http
			.post('/api/v1/user', {
				fname: 'getUser1',
				lname: 'getUser',
				username: 'basicGetUser1',
				password: 'password123',
				email: 'basicGetUser1@get.com'
			})
			.catch((error) => fail(JSON.stringify(error)));

		this.user2 = await http
			.post('/api/v1/user', {
				fname: 'getUser2',
				lname: 'getUser',
				username: 'basicGetUser2',
				password: 'password123',
				email: 'basicGetUser2@get.com'
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can read all', async () => {
		await http
			.get('/api/v1/user', {}, [ 200 ])
			.then((result) => expect(result.body).toEqual(jasmine.any(Array)))
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can read many', async () => {
		await http
			.get('/api/v1/user', {
				lname: 'getUser'
			})
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Array));
				expect(result.body['length']).toBeGreaterThanOrEqual(2);
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can read one', async () => {
		await http
			.get('/api/v1/user', {
				id: this.user1.body.id
			})
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Object));
				expect(result.body['fname']).toEqual('getUser1');
			})
			.catch((error) => fail(JSON.stringify(error)));
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
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can search', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'searchTester',
				lname: 'getUser',
				username: 'searchTester',
				password: 'password123',
				email: 'searchTester@get.com'
			})
			.catch((error) => fail(JSON.stringify(error)));

		await http
			.get('/api/v1/user', {
				__search: 'searchTester'
			})
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Array));
				expect(result.body['length']).toEqual(1);
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can group by', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'groupTester',
				lname: 'agroupBy',
				username: 'groupTester1',
				password: 'password123',
				email: 'groupTester1@get.com'
			})
			.catch((error) => fail(JSON.stringify(error)));
		await http
			.post('/api/v1/user', {
				fname: 'groupTester',
				lname: 'agroupBy',
				username: 'groupTester2',
				password: 'password123',
				email: 'groupTester2@get.com'
			})
			.catch((error) => fail(JSON.stringify(error)));

		await http
			.get('/api/v1/user', {
				__search: '',
				__groupBy: [ 'lname', 'id' ]
			})
			.then((result) => {
				expect(result.body[0].id).toBeGreaterThanOrEqual(3);
			})
			.catch((error) => fail(JSON.stringify(error)));
	});
});
