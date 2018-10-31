import { mockRequest, mockResponse } from 'mock-req-res';

import { setModel } from '../../../../src/';
import { BaseUser } from '../../../../src/models';
import { deleteEndpoint } from '../../../../src/endpoints';
import { getRepository } from 'typeorm';

async function createMockup() {
	const request = mockRequest();
	request.repository = await getRepository(BaseUser);

	const response = mockResponse();
	response.error = (error) => fail(error);
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
			.catch((error) => fail(error));

		request.identifier = 'id';
		request.params = result;

		setModel(request, response, BaseUser);

		response.deleteResponder = () => {};
		await deleteEndpoint(request, response).catch((error) => fail(error));
	});

	it('calls response.goneResponder() if object not found', async () => {
		const { request, response } = await createMockup();

		request.identifier = 'id';
		request.params = {
			id: 12345
		};

		setModel(request, response, BaseUser);

		response.goneResponder = () => {};
		await deleteEndpoint(request, response).catch((error) => fail(error));
	});
});