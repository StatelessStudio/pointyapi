import { mockRequest, mockResponse } from 'mock-req-res';

import { setModel } from '../../../../src/';
import { BaseUser } from '../../../../src/models';
import { deleteEndpoint } from '../../../../src/endpoints';
import { getRepository } from 'typeorm';

async function createMockup() {
	const request = mockRequest();
	request.repository = await getRepository(BaseUser);
	request.method = 'DELETE';
	request.baseUrl = '/api/v1/user';
	request.userType = BaseUser;
	request.joinMembers = [];

	const response = mockResponse();
	response.error = (error) => fail(JSON.stringify(error));
	response.goneResponder = (error) => fail('Gone: ' + JSON.stringify(error));
	response.deleteResponder = (msg) => fail('Deleted: ' + JSON.stringify(msg));

	return { request, response };
}

describe('[Endpoints] Delete', () => {
	it('can delete', async () => {
		const { request, response } = await createMockup();

		const user = new BaseUser();
		user.fname = 'Delete';
		user.lname = 'Endpoint';
		user.username = 'deleteEndpoint';
		user.password = 'password123';
		user.email = 'delete@example.com';

		const result = await getRepository(BaseUser)
			.save(user)
			.catch((error) => fail(JSON.stringify(error)));

		request.identifier = 'id';
		request.params = result;

		await setModel(request, response, BaseUser);

		response.deleteResponder = () => {};
		await deleteEndpoint(request, response).catch((error) =>
			fail(JSON.stringify(error))
		);
	});

	it('calls response.goneResponder() if object not found', async () => {
		const { request, response } = await createMockup();

		request.identifier = 'id';
		request.params = {
			id: 12345
		};

		response.goneResponder = () => {};
		await setModel(request, response, BaseUser);

		request.payload = undefined;

		await deleteEndpoint(request, response).catch((error) =>
			fail(JSON.stringify(error))
		);
	});
});
