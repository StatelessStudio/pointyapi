import 'jasmine';
import { getRepository, Entity } from 'typeorm';

import { createMockRequest } from '../../../../src/test-probe';
import { ExampleUser, BaseModel } from '../../../../src/models';
import { getFilter } from '../../../../src/filters';
import { OnlySelfCanRead, OnlyAdminCanRead, AnyoneCanRead } from '../../../../src/bodyguard';

class OnlySelfCanReadMember extends BaseModel {
	@OnlySelfCanRead() public id: number = undefined;
}

class OnlyAdminCanReadMember extends BaseModel {
	@OnlyAdminCanRead() public id: number = undefined;
}

class NobodyCanReadMember extends BaseModel {
	public id: number = undefined;
}

class EntityWithJSONColumn extends BaseModel {
	@AnyoneCanRead() public options: Object = undefined;
}

/**
 * getFilter()
 * pointyapi/guards
 */
describe('[Guards] getFilter', async () => {
	let user;

	beforeAll(async () => {
		// Create mock user
		user = new ExampleUser();
		user.fname = 'tom';
		user.lname = 'doe';
		user.username = 'tomFilter';
		user.email = 'tomFilter@example.com';
		user.password = 'password123';

		await getRepository(ExampleUser)
			.save(user)
			.catch((error) => fail(error));
	});

	it('filters the payload', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create request
		request.query = { where: { fname: 'tom' } };
		request.payload = [ user ];

		// Filter
		let result = false;
		const next = () => {
			result = true;
		};

		getFilter(request, response, next);

		expect(result).toBe(true);
		expect(request.payload[0]).toEqual(jasmine.any(ExampleUser));
		expect(request.payload[0].fname).toEqual('tom');
		expect(request.payload[0].password).toEqual(undefined);
	});

	it('refuses unauthenticated requests (object)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create request
		request.query = { where: { password: 'password123' } };
		request.payload = [ user ];

		// Filter
		let result = false;
		response.forbiddenResponder = () => {
			result = true;
		};

		getFilter(request, response, fail);

		expect(result).toBe(true);
	});

	it('refuses unauthenticated is-self requests (object)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create request
		request.query = { where: { id: 'password123' } };
		request.payload = [ new OnlySelfCanReadMember() ];
		request.payloadType = OnlySelfCanReadMember;

		// Filter
		let result = false;
		response.forbiddenResponder = () => {
			result = true;
		};

		getFilter(request, response, fail);

		expect(result).toBe(true);
	});

	it('refuses authenticated is-admin requests (object)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create request
		request.query = { where: { id: 'password123' } };
		request.payload = [ new OnlyAdminCanReadMember() ];
		request.payloadType = OnlyAdminCanReadMember;

		// Filter
		let result = false;
		response.forbiddenResponder = () => {
			result = true;
		};

		getFilter(request, response, fail);

		expect(result).toBe(true);
	});

	it('refuses authenticated no-read requests (object)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create request
		request.query = { where: { id: 'password123' } };
		request.payload = [ new NobodyCanReadMember() ];
		request.payloadType = NobodyCanReadMember;

		// Filter
		let result = false;
		response.forbiddenResponder = () => {
			result = true;
		};

		getFilter(request, response, fail);

		expect(result).toBe(true);
	});

	it('parses joined members (object)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create request
		request.query = { orderBy: { 'relations.id': 'ASC' } };
		request.payload = [ user ];
		response.forbiddenResponder = (message) => {
			expect(message).toBe('Cannot get by member relations');
		};

		getFilter(request, response, () => {});
	});

	it('refuses unauthenticated requests (array)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create request
		request.query = { select: [ 'password' ] };
		request.payload = [ user ];

		// Filter
		let result = false;
		response.forbiddenResponder = () => {
			result = true;
		};

		getFilter(request, response, fail);

		expect(result).toBe(true);
	});

	it('refuses unauthenticated is-self requests (array)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create request
		request.query = { select: [ 'id' ] };
		request.payload = [ new OnlySelfCanReadMember() ];
		request.payloadType = OnlySelfCanReadMember;

		// Filter
		let result = false;
		response.forbiddenResponder = () => {
			result = true;
		};

		getFilter(request, response, fail);

		expect(result).toBe(true);
	});

	it('refuses authenticated is-admin requests (array)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create request
		request.query = { select: [ 'id' ] };
		request.payload = [ new OnlyAdminCanReadMember() ];
		request.payloadType = OnlyAdminCanReadMember;

		// Filter
		let result = false;
		response.forbiddenResponder = () => {
			result = true;
		};

		getFilter(request, response, fail);

		expect(result).toBe(true);
	});

	it('refuses authenticated no-read requests (array)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create request
		request.query = { select: [ 'id' ] };
		request.payload = [ new NobodyCanReadMember() ];
		request.payloadType = NobodyCanReadMember;

		// Filter
		let result = false;
		response.forbiddenResponder = () => {
			result = true;
		};

		getFilter(request, response, fail);

		expect(result).toBe(true);
	});

	it('parses joined members (array)', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create request
		request.query = { select: [ 'relations.id' ] };
		request.payload = [ user ];
		response.forbiddenResponder = (message) => {
			expect(message).toBe('Cannot get by member relations');
		};

		getFilter(request, response, () => {});
	});

	// https://github.com/StatelessStudio/pointyapi/issues/197
	it('allows JSON column value to pass', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create request
		const entity: EntityWithJSONColumn = {
			options: {
				enableSomething: true
			}
		};

		request.query = { select: [ 'options' ] };
		request.payload = [ entity ];
		request.payloadType = EntityWithJSONColumn;

		// Filter
		let result = false;

		getFilter(request, response, () => {
			if (request.payload && request.payload.length) {
				if ('options' in request.payload[0]) {
					if ('enableSomething' in request.payload[0].options) {
						result = true;
					}
					else {
						fail('enableSomething was removed from payload.');
					}
				}
				else {
					fail('No options column returned.');
				}
			}
			else {
				fail('No payload returned.');
			}
		});

		expect(result).toBe(true);
	});
});
