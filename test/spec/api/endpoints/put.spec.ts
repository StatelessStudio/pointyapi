import { mockRequest, mockResponse } from 'mock-req-res';
import { getRepository } from 'typeorm';

import { setModel } from '../../../../src';
import { BaseUser } from '../../../../src/models';
import { putEndpoint } from '../../../../src/endpoints';

async function createMockup() {
	const request = mockRequest();
	request.repository = await getRepository(BaseUser);
	request.method = 'PUT';

	const response = mockResponse();
	response.error = (error) => fail(error);
	response.validationResponder = (msg) =>
		fail('Validation: ' + JSON.stringify(msg));
	response.putResponder = (msg) => fail('Deleted: ' + JSON.stringify(msg));

	return { request, response };
}

describe('[Endpoints] Put', () => {
	it('can put', async () => {
		const { request, response } = await createMockup();

		const user = new BaseUser();
		user.fname = 'Put';
		user.lname = 'Endpoint';
		user.username = 'putEndpoint';
		user.password = 'password123';
		user.email = 'put@example.com';

		request.body = user;

		setModel(request, response, BaseUser);

		response.putResponder = () => {};
		await putEndpoint(request, response).catch((error) => fail(error));
	});

	it('calls validationResponder for a bad request', async () => {
		const { request, response } = await createMockup();

		const user = new BaseUser();
		user.fname = 'Put';
		user.lname = 'Endpoint';
		user.username = 'putEndpoint2';
		user.password = 'password123';
		user.email = 'testy';

		request.body = user;

		setModel(request, response, BaseUser);

		response.validationResponder = () => {};
		await putEndpoint(request, response).catch((error) => fail(error));
	});
});
