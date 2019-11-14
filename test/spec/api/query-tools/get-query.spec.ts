import { getRepository } from 'typeorm';

import { setModel } from '../../../../src';
import { ExampleUser } from '../../../../src/models';
import { getQuery } from '../../../../src/middleware';
import { createMockRequest } from '../../../../src/test-probe';
import { ExampleOwner } from '../../../examples/api/models/example-owner';
import { ExampleRelation } from '../../../examples/api/models/example-relation';
import { UserRole } from '../../../../src/enums';

/**
 * getQuery()
 * pointyapi/query-tools
 */
describe('[QueryTools] GetQuery', () => {
	let user1;
	let user2;

	beforeAll(async () => {
		// Create users
		user1 = new ExampleUser();
		user1.fname = 'Get';
		user1.lname = 'Endpoint';
		user1.username = 'getEndpoint1';
		user1.password = 'password123';
		user1.email = 'get1@example.com';

		user2 = new ExampleUser();
		user2.fname = 'Get';
		user2.lname = 'Endpoint';
		user2.username = 'getEndpoint2';
		user2.password = 'password123';
		user2.email = 'get2@example.com';

		// Save users
		await getRepository(ExampleUser)
			.save([ user1, user2 ])
			.catch((error) =>
				fail('Could not save users: ' + JSON.stringify(error))
			);

		// Create example relation
		const owner = new ExampleOwner();
		owner.username = 'joinowner';

		await getRepository(ExampleOwner)
			.save(owner)
			.catch((error) =>
				fail('Could not save owner: ' + JSON.stringify(error))
			);

		const relation = new ExampleRelation();
		relation.owner = owner;

		await getRepository(ExampleRelation)
			.save(relation)
			.catch((error) =>
				fail('Could not save relation: ' + JSON.stringify(error))
			);
	});

	it('can search (string)', async () => {
		// Create mock request/response
		// Use '' request method to prevent setModel() from running getQuery
		const { request, response } = createMockRequest('');

		// Create request
		request.query = {
			search: 'get%@example.com'
		};

		// Set model
		if (!await setModel(request, response, ExampleUser)) {
			fail('Could not set model');
		}

		// Test getQuery()
		await getQuery(request, response)
			.then((result) => {
				request.payload = result;
			})
			.catch((error) => fail('Could not get: ' + JSON.stringify(error)));

		expect(request.payload).toEqual(jasmine.any(Array));
		expect(request.payload.length).toBe(2);
	});

	it('can select keys', async () => {
		// Create mock request/response
		// Use '' request method to prevent setModel() from running getQuery
		const { request, response } = createMockRequest('');

		// Create request
		request.query = {
			search: 'get%@example.com',
			select: [ 'fname' ]
		};

		// Set model
		if (!await setModel(request, response, ExampleUser)) {
			fail('Could not set model');
		}

		// Test getQuery()
		await getQuery(request, response)
			.then((result) => {
				request.payload = result;
			})
			.catch((error) => fail('Could not get: ' + JSON.stringify(error)));

		expect(request.payload).toEqual(jasmine.any(Array));
		expect(request.payload.length).toBe(2);
		expect(request.payload[0].fname).toBe('Get');
		expect(request.payload[0].lname).toBe(undefined);
	});

	it('can join keys', async () => {
		// Create mock request/response
		// Use '' request method to prevent setModel() from running getQuery
		const { request, response } = createMockRequest('');

		// Create request
		request.query = {
			join: [ 'relations' ]
		};

		// Set model
		request.userType = ExampleOwner;
		if (!await setModel(request, response, ExampleOwner)) {
			fail('Could not set model');
		}

		// Test getQuery()

		await getQuery(request, response)
			.then((result) => {
				request.payload = result;
			})
			.catch((error) => fail('Could not get: ' + JSON.stringify(error)));

		expect(request.payload).toEqual(jasmine.any(Array));
		expect(request.payload.length).toBeGreaterThanOrEqual(1);
		expect(request.payload[0]).toEqual(jasmine.any(ExampleOwner));
		expect(request.payload[0].relations).toEqual(jasmine.any(Array));
		expect(request.payload[0].relations.length).toBeGreaterThanOrEqual(1);
		expect(request.payload[0].relations[0]).toEqual(
			jasmine.any(ExampleRelation)
		);
	});

	it('can group keys', async () => {
		// Create mock request/response
		// Use '' request method to prevent setModel() from running getQuery
		const { request, response } = createMockRequest('');

		// Create request
		request.query = {
			groupBy: [ 'fname' ]
		};

		// Set model
		if (!await setModel(request, response, ExampleUser)) {
			fail('Could not set model');
		}

		// Test getQuery()
		await getQuery(request, response)
			.then((result) => {
				request.payload = result;
			})
			.catch((error) => fail('Could not get: ' + JSON.stringify(error)));

		expect(request.payload).toEqual(jasmine.any(Array));
	});

	it('can order keys', async () => {
		// Create mock request/response
		// Use '' request method to prevent setModel() from running getQuery
		const { request, response } = createMockRequest('');

		// Create request
		request.query = {
			orderBy: { fname: 'DESC', lname: 'ASC' }
		};

		// Set model
		if (!await setModel(request, response, ExampleUser)) {
			fail('Could not set model');
		}

		// Test getQuery()
		await getQuery(request, response)
			.then((result) => {
				request.payload = result;
			})
			.catch((error) => fail('Could not get: ' + JSON.stringify(error)));

		expect(request.payload).toEqual(jasmine.any(Array));
	});

	it('can limit', async () => {
		// Create mock request/response
		// Use '' request method to prevent setModel() from running getQuery
		const { request, response } = createMockRequest('');

		// Create request
		request.query = {
			limit: 1
		};

		// Set model
		if (!await setModel(request, response, ExampleUser)) {
			fail('Could not set model');
		}

		// Test getQuery()
		await getQuery(request, response)
			.then((result) => {
				request.payload = result;
			})
			.catch((error) => fail('Could not get: ' + JSON.stringify(error)));

		expect(request.payload).toEqual(jasmine.any(Array));
		expect(request.payload.length).toEqual(1);
	});

	it('can offset', async () => {
		// Create mock request/response
		// Use '' request method to prevent setModel() from running getQuery
		const { request, response } = createMockRequest('');

		// Create request
		request.query = {
			offset: 1
		};

		// Set model
		if (!await setModel(request, response, ExampleUser)) {
			fail('Could not set model');
		}

		// Test getQuery()
		await getQuery(request, response)
			.then((result) => {
				request.payload = result;
			})
			.catch((error) => fail('Could not get: ' + JSON.stringify(error)));

		expect(request.payload).toEqual(jasmine.any(Array));
	});

	it('can get raw', async () => {
		// Create mock request/response
		// Use '' request method to prevent setModel() from running getQuery
		const { request, response } = createMockRequest('');

		// Create request
		request.query = {
			raw: true
		};

		// Set model
		if (!await setModel(request, response, ExampleUser)) {
			fail('Could not set model');
		}

		// Test getQuery()
		await getQuery(request, response)
			.then((result) => {
				request.payload = result;
			})
			.catch((error) => fail('Could not get: ' + JSON.stringify(error)));

		expect(request.payload).toEqual(jasmine.any(Array));
	});

	it('can get one', async () => {
		// Create mock request/response
		// Use '' request method to prevent setModel() from running getQuery
		const { request, response } = createMockRequest('');

		// Create request
		request.query = {
			id: user1.id
		};

		// Set model
		if (!await setModel(request, response, ExampleUser)) {
			fail('Could not set model');
		}

		// Test getQuery()
		await getQuery(request, response)
			.then((result) => {
				request.payload = result;
			})
			.catch((error) => fail('Could not get: ' + JSON.stringify(error)));

		expect(request.payload).toEqual(jasmine.any(ExampleUser));
	});

	it('can get all', async () => {
		// Create mock request/response
		// Use '' request method to prevent setModel() from running getQuery
		const { request, response } = createMockRequest('');

		// Create request
		request.query = {};

		// Set model
		if (!await setModel(request, response, ExampleUser)) {
			fail('Could not set model');
		}

		// Test getQuery()
		await getQuery(request, response)
			.then((result) => {
				request.payload = result;
			})
			.catch((error) => fail('Could not get: ' + JSON.stringify(error)));

		expect(request.payload).toEqual(jasmine.any(Array));
	});

	it('can get non-owner models', async () => {
		// Create mock request/response
		// Use '' request method to prevent setModel() from running getQuery
		const { request, response } = createMockRequest('');

		// Create request
		request.query = { search: '' };

		// Set model
		request.userType = ExampleOwner;
		if (!await setModel(request, response, ExampleRelation)) {
			fail('Could not set model');
		}

		// Test getQuery()
		await getQuery(request, response)
			.then((result) => {
				request.payload = result;
			})
			.catch((error) => fail('Could not get: ' + JSON.stringify(error)));

		expect(request.payload).toEqual(jasmine.any(Array));
	});

	it('can get non-owner models (non-admin)', async () => {
		// Create mock request/response
		// Use '' request method to prevent setModel() from running getQuery
		const { request, response } = createMockRequest('');

		// Create request
		request.query = { search: '' };
		request.user = new ExampleOwner();
		request.user.role = UserRole.Basic;

		// Set model
		request.userType = ExampleOwner;
		if (!await setModel(request, response, ExampleRelation)) {
			fail('Could not set model');
		}

		// Test getQuery()
		await getQuery(request, response)
			.then((result) => {
				request.payload = result;
			})
			.catch((error) => fail('Could not get: ' + JSON.stringify(error)));

		expect(request.payload).toEqual(jasmine.any(Array));
	});
});
