import { getRepository } from 'typeorm';

import { createMockRequest } from '../../../../src/test-probe';
import { ExampleUser, BaseModel } from '../../../../src/models';
import { getFilter } from '../../../../src/filters';
import { OnlySelfCanRead, OnlyAdminCanRead } from '../../../../src/bodyguard';

class OnlySelfCanReadMember extends BaseModel {
	@OnlySelfCanRead() public id: number = undefined;
}

class OnlyAdminCanReadMember extends BaseModel {
	@OnlyAdminCanRead() public id: number = undefined;
}

class NobodyCanReadMember extends BaseModel {
	public id: number = undefined;
}

/**
 * getFilter()
 * pointyapi/guards
 */
describe('[Guards] getFilter', async () => {
	beforeAll(async () => {
		// Create mock user
		this.user = new ExampleUser();
		this.user.fname = 'tom';
		this.user.lname = 'doe';
		this.user.username = 'tomFilter';
		this.user.email = 'tomFilter@example.com';
		this.user.password = 'password123';

		await getRepository(ExampleUser)
			.save(this.user)
			.catch((error) => fail(error));
	});

	it('filters the payload', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create request
		request.query = { where: { fname: 'tom' } };
		request.payload = [ this.user ];

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
		request.payload = [ this.user ];

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
		request.payload = [ this.user ];
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
		request.payload = [ this.user ];

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
		request.payload = [ this.user ];
		response.forbiddenResponder = (message) => {
			expect(message).toBe('Cannot get by member relations');
		};

		getFilter(request, response, () => {});
	});
});
