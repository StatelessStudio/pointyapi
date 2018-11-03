import { mockRequest, mockResponse } from 'mock-req-res';
import { getRepository } from 'typeorm';

import { setModel } from '../../../../src';
import { BaseUser } from '../../../../src/models';
import { getQuery } from '../../../../src/middleware';

async function createMockup() {
	const request = mockRequest();
	request.repository = await getRepository(BaseUser);
	request.method = 'GET';

	const response = mockResponse();
	response.error = (error) => fail(error);

	return { request, response };
}

describe('[Endpoints] GetQuery', () => {
	it('can search', async () => {
		const { request, response } = await createMockup();

		request.query.search = 'tom';

		const user1 = new BaseUser();
		user1.fname = 'Get';
		user1.lname = 'Endpoint';
		user1.username = 'getEndpoint1';
		user1.password = 'password123';
		user1.email = 'get1@example.com';

		const user2 = new BaseUser();
		user2.fname = 'Get';
		user2.lname = 'Endpoint';
		user2.username = 'getEndpoint2';
		user2.password = 'password123';
		user2.email = 'get2@example.com';

		const result = await getRepository(BaseUser)
			.save([ user1, user2 ])
			.catch((error) => fail(error));

		await setModel(request, response, BaseUser);

		await getQuery(request, response).catch((error) => fail(error));

		expect(request.payload).toEqual(jasmine.any(Array));
		expect(request.payload.length).toBeGreaterThanOrEqual(2);
	});
});
