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
				__groupBy: [ 'lname' ]
			})
			.then((result) => {
				expect(result.body[0].id).toBeGreaterThanOrEqual(3);
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can order by', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'orderTester',
				lname: 'zorderBy',
				username: 'orderTester1',
				password: 'password123',
				email: 'orderTester1@get.com'
			})
			.catch((error) => fail(JSON.stringify(error)));
		await http
			.post('/api/v1/user', {
				fname: 'orderTester',
				lname: 'zorderBy',
				username: 'orderTester2',
				password: 'password123',
				email: 'orderTester2@get.com'
			})
			.catch((error) => fail(JSON.stringify(error)));

		await http
			.get('/api/v1/user', {
				__search: '',
				__orderBy: {
					lname: 'DESC'
				}
			})
			.then((result) => {
				expect(result.body[0].lname).toEqual('zorderBy');
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can limit', async () => {
		await http
			.get('/api/v1/user', {
				__search: '',
				__limit: 1
			})
			.then((result) => {
				expect(result.body['length']).toBe(1);
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can offset', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'offsetTest',
				lname: 'offsetTest',
				username: 'offsetTest',
				password: 'password123',
				email: 'offsetTest@get.com'
			})
			.catch((error) => fail(JSON.stringify(error)));

		await http
			.get('/api/v1/user', {
				__search: '',
				__offset: 2
			})
			.then((result) => {
				expect(result.body[0].id).toBeGreaterThanOrEqual(3);
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can search by range', async () => {
		const user = await http
			.post('/api/v1/user', {
				fname: 'rangeTest',
				lname: 'rangeTest',
				username: 'rangeTest',
				password: 'password123',
				email: 'rangeTest@get.com'
			})
			.catch((error) => fail(JSON.stringify(error)));

		if (user) {
			await http
				.get('/api/v1/user', {
					__search: '',
					__between: {
						id: [ user.body['id'], user.body['id'] ]
					}
				})
				.then((result) => {
					expect(result.body[0].lname).toEqual('rangeTest');
				})
				.catch((error) => fail(JSON.stringify(error)));
		}
	});

	it('can search by less than', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'lessThanTest',
				lname: 'lessThanTest',
				username: 'lessThanTest',
				password: 'password123',
				email: 'lessThanTest@get.com'
			})
			.catch((error) => fail(JSON.stringify(error)));

		await http
			.get('/api/v1/user', {
				__search: '',
				__lessThan: {
					id: 1
				}
			})
			.then((result) => {
				expect(result.body['length']).toBe(0);
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can search by greater than', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'greaterThanTest',
				lname: 'greaterThanTest',
				username: 'greaterThanTest',
				password: 'password123',
				email: 'greaterThanTest@get.com'
			})
			.catch((error) => fail(JSON.stringify(error)));

		await http
			.get('/api/v1/user', {
				__search: '',
				__greaterThan: {
					id: 1
				}
			})
			.then((result) => {
				expect(result.body['length']).toBeGreaterThanOrEqual(1);
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can search by less than or equal to', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'lessThanOrEqual',
				lname: 'lessThanOrEqual',
				username: 'lessThanOrEqual',
				password: 'password123',
				email: 'lessThanOrEqual@get.com'
			})
			.catch((error) => fail(JSON.stringify(error)));

		await http
			.get('/api/v1/user', {
				__search: '',
				__lessThanOrEqual: {
					id: 1
				}
			})
			.then((result) => {
				expect(result.body['length']).toBeLessThanOrEqual(1);
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can search by less than or equal to', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'greaterThanOrEqual',
				lname: 'greaterThanOrEqual',
				username: 'greaterOrEqual',
				password: 'password123',
				email: 'greaterThanOrEqual@get.com'
			})
			.catch((error) => fail(JSON.stringify(error)));

		await http
			.get('/api/v1/user', {
				__search: '',
				__greaterThanOrEqual: {
					id: 1
				}
			})
			.then((result) => {
				expect(result.body['length']).toBeGreaterThanOrEqual(1);
			})
			.catch((error) => fail(JSON.stringify(error)));
	});
});
