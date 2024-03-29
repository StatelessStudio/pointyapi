import 'jasmine';
import { pointy } from '../../../../src';
const http = pointy.http;

describe('User API Read', () => {
	let user1;
	let user2;

	beforeAll(async () => {
		user1 = await http
			.post('/api/v1/user', {
				fname: 'getUser1',
				lname: 'getUser',
				username: 'basicGetUser1',
				password: 'password123',
				email: 'basicGetUser1@get.com'
			});

		user2 = await http
			.post('/api/v1/user', {
				fname: 'getUser2',
				lname: 'getUser',
				username: 'basicGetUser2',
				password: 'password123',
				email: 'basicGetUser2@get.com'
			});
	});

	it('can read all', async () => {
		await http
			.get('/api/v1/user', {})
			.then((result) => expect(result.body).toEqual(jasmine.any(Array)));
	});

	it('can read many', async () => {
		await http
			.get('/api/v1/user', {
				where: {
					lname: 'getUser'
				}
			})
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Array));
				expect(result.body['length']).toBeGreaterThanOrEqual(2);
			});
	});

	it('can read one', async () => {
		await http
			.get('/api/v1/user', {
				id: user1.body.id
			})
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Object));
				expect(result.body['fname']).toEqual('getUser1');
			});
	});

	it('returns 410 for a not found user', async () => {
		await http
			.get(
				'/api/v1/user',
				{
					id: 12345
				},
				undefined,
				[ 410 ]
			);
	});

	it('can search', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'searchTester',
				lname: 'getUser',
				username: 'searchTester',
				password: 'password123',
				email: 'searchTester@get.com'
			});

		await http
			.get('/api/v1/user', {
				search: 'searchtester'
			})
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Array));
				expect(result.body['length']).toEqual(1);
			});
	});

	it('can get raw data', async () => {
		await http
			.get('/api/v1/user', {
				raw: true,
				select: [ 'lname' ]
			})
			.then((result) => {
				expect(result.body[0].obj_lname).toEqual(jasmine.any(String));
			});
	});

	it('can select keys', async () => {
		await http
			.get('/api/v1/user', {
				select: [ 'lname' ]
			})
			.then((result) => {
				expect(result.body[0].lname).toEqual(jasmine.any(String));
				expect(result.body[0].fname).toEqual(undefined);
			});
	});

	it('cannot select private keys', async () => {
		await http
			.get(
				'/api/v1/user',
				{
					select: [ 'password' ]
				},
				undefined,
				[ 403 ]
			);
	});

	it('can count', async () => {
		await http
			.get('/api/v1/user', {
				count: true
			})
			.then((result) => {
				expect(result.body['count']).toBeGreaterThanOrEqual(2);
			});

		await http
			.get('/api/v1/user', {
				search: 'basicGetUser1',
				count: true
			})
			.then((result) => {
				expect(result.body['count']).toEqual(1);
			});

		await http
			.get('/api/v1/user', {
				count: true,
				where: {
					username: 'basicGetUser1'
				}
			})
			.then((result) => {
				expect(result.body['count']).toEqual(1);
			});
	});

	it('can group by', async () => {
		// Create users
		await http
			.post('/api/v1/user', {
				fname: 'groupTester',
				lname: 'agroupBy',
				username: 'groupTester1',
				password: 'password123',
				email: 'groupTester1@get.com'
			});

		await http
			.post('/api/v1/user', {
				fname: 'groupTester',
				lname: 'agroupBy',
				username: 'groupTester2',
				password: 'password123',
				email: 'groupTester2@get.com'
			});

		// Get results
		await http
			.get('/api/v1/user', {
				select: [ 'lname' ],
				groupBy: [ 'lname' ]
			})
			.then((result) => {
				if (result.body instanceof Array) {
					let nMatches = 0;

					for (const resource of result.body) {
						if (resource.lname === 'agroupBy') {
							nMatches++;
						}
					}

					expect(nMatches).toBe(1);
				}
				else {
					fail('Result is not an array');
				}
			});
	});

	it('can order by', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'orderTester',
				lname: 'zorderBy',
				username: 'orderTester1',
				password: 'password123',
				email: 'orderTester1@get.com'
			});
		await http
			.post('/api/v1/user', {
				fname: 'orderTester',
				lname: 'zorderBy',
				username: 'orderTester2',
				password: 'password123',
				email: 'orderTester2@get.com'
			});

		await http
			.get('/api/v1/user', {
				orderBy: {
					lname: 'desc'
				}
			})
			.then((result) => {
				expect(result.body[0].lname).toEqual('zorderBy');
			});
	});

	it('can order rand', async () => {
		await http
			.get('/api/v1/user', {
				order: 'random'
			})
			.then((result) => {
				expect(result.body[0].lname).toBeTruthy();
			});
	});

	it('can limit', async () => {
		await http
			.get('/api/v1/user', {
				limit: 1
			})
			.then((result) => {
				expect(result.body['length']).toBe(1);
			});
	});

	it('can offset', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'offsetTest',
				lname: 'offsetTest',
				username: 'offsetTest',
				password: 'password123',
				email: 'offsetTest@get.com'
			});

		await http
			.get('/api/v1/user', {
				offset: 2
			})
			.then((result) => {
				expect(result.body[0].id).toBeGreaterThanOrEqual(3);
			});
	});

	it('can search by range', async () => {
		const user = await http
			.post('/api/v1/user', {
				fname: 'rangeTest',
				lname: 'rangeTest',
				username: 'rangeTest',
				password: 'password123',
				email: 'rangeTest@get.com'
			});

		if (user) {
			await http
				.get('/api/v1/user', {
					between: {
						id: [ user.body['id'], user.body['id'] ]
					}
				})
				.then((result) => {
					expect(result.body[0].lname).toEqual('rangeTest');
				});
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
			});

		await http
			.get('/api/v1/user', {
				lessThan: {
					id: 1
				}
			})
			.then((result) => {
				expect(result.body['length']).toBe(0);
			});
	});

	it('can search by greater than', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'greaterThanTest',
				lname: 'greaterThanTest',
				username: 'greaterThanTest',
				password: 'password123',
				email: 'greaterThanTest@get.com'
			});

		await http
			.get('/api/v1/user', {
				greaterThan: {
					id: 1
				}
			})
			.then((result) => {
				expect(result.body['length']).toBeGreaterThanOrEqual(1);
			});
	});

	it('can search by greater than another column', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'greaterThanCTest',
				lname: 'greaterThanCTest',
				username: 'greaterThanCTest',
				password: 'password123',
				email: 'greaterThanCTest@get.com'
			});

		await http
			.get('/api/v1/user', {
				greaterThan: {
					fname: {
						column: 'lname'
					}
				}
			})
			.then((result) => {
				expect(result.body['length']).toBeGreaterThanOrEqual(1);
			});
	});

	it('can search by less than or equal to', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'lessThanOrEqual',
				lname: 'lessThanOrEqual',
				username: 'lessThanOrEqual',
				password: 'password123',
				email: 'lessThanOrEqual@get.com'
			});

		await http
			.get('/api/v1/user', {
				lessThanOrEqual: {
					id: 1
				}
			})
			.then((result) => {
				expect(result.body['length']).toBeLessThanOrEqual(1);
			});
	});

	it('can search by less than or equal to', async () => {
		await http
			.post('/api/v1/user', {
				fname: 'greaterThanOrEqual',
				lname: 'greaterThanOrEqual',
				username: 'greaterOrEqual',
				password: 'password123',
				email: 'greaterThanOrEqual@get.com'
			});

		await http
			.get('/api/v1/user', {
				greaterThanOrEqual: {
					id: 1
				}
			})
			.then((result) => {
				expect(result.body['length']).toBeGreaterThanOrEqual(1);
			});
	});

	it('can search by not', async () => {
		const user = await http
			.post('/api/v1/user', {
				fname: 'searchNot',
				lname: 'searchNot',
				username: 'searchNot',
				password: 'password123',
				email: 'searchNot@get.com'
			});

		if (user) {
			await http
				.get('/api/v1/user', {
					not: {
						id: user.body['id']
					}
				})
				.then((result) => {
					if (result.body instanceof Array) {
						for (const res of result.body) {
							expect(res['fname']).not.toBe('searchNot');
						}
					}
					else {
						fail('Result is not an array');
					}
				});

			await http
				.get('/api/v1/user', {
					not: {
						fname: 'searchNot'
					}
				})
				.then((result) => {
					if (result.body instanceof Array) {
						for (const res of result.body) {
							expect(res['fname']).not.toBe('searchNot');
						}
					}
					else {
						fail('Result is not an array');
					}
				});
		}
	});
});
